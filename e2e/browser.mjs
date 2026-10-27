// Браузер для e2e-тестов: Chrome / Edge / Chromium без окна, управление по CDP (Chrome DevTools Protocol).
// Без зависимостей — только Node (fetch и WebSocket встроены с Node 22).
//
// Сайт должен быть запущен: npm run dev (или next start). Адрес — E2E_URL (по умолчанию http://localhost:3000),
// браузер — E2E_BROWSER (путь к exe), иначе ищется в обычных местах. Нет сайта или браузера — тесты пропускаются.

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const BASE = (process.env.E2E_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

const CANDIDATES = [
  process.env.E2E_BROWSER,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/opt/pw-browsers/chromium",
];

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** почему тесты нельзя запустить (или null — можно) */
export async function unavailable() {
  if (!CANDIDATES.some((p) => p && existsSync(p)))
    return "не найден Chrome / Edge — укажите путь в E2E_BROWSER";
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) return `${BASE} отвечает ${res.status}`;
  } catch {
    return `сайт ${BASE} не отвечает — запустите npm run dev`;
  }
  return null;
}

/** первый заход на страницу в dev компилирует её — прогреваем, чтобы компиляция не попала в замеры */
export async function warm(paths) {
  for (const p of paths) await fetch(BASE + p).catch(() => {});
}

export async function launch() {
  const exe = CANDIDATES.find((p) => p && existsSync(p));
  const profile = mkdtempSync(join(tmpdir(), "rendit-e2e-"));
  const port = 9300 + Math.floor(Math.random() * 600);
  const proc = spawn(exe, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars=false",
    "about:blank",
  ]);
  let version;
  for (let i = 0; i < 100 && !version; i++) {
    try {
      version = await (
        await fetch(`http://127.0.0.1:${port}/json/version`)
      ).json();
    } catch {
      await sleep(100);
    }
  }
  if (!version) throw new Error("браузер не запустился");

  return {
    /** новая вкладка; viewport — { width, height, mobile }, theme — 'light' | 'dark' */
    async page({
      width = 1280,
      height = 800,
      mobile = false,
      theme = "light",
    } = {}) {
      const target = await (
        await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
          method: "PUT",
        })
      ).json();
      const page = await connect(target.webSocketDebuggerUrl);
      page.targetId = target.id;
      await page.send("Page.enable");
      await page.send("Runtime.enable");
      await page.send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile,
      });
      if (mobile)
        await page.send("Emulation.setTouchEmulationEnabled", {
          enabled: true,
        });
      await page.send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-color-scheme", value: theme }],
      });
      page.closeTab = () =>
        fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(
          () => {},
        );
      return page;
    },
    async close() {
      proc.kill();
      await sleep(300);
      try {
        rmSync(profile, { recursive: true, force: true });
      } catch {}
    },
  };
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  const waiters = [];
  const errors = [];
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      if (m.error)
        reject(new Error(`${m.error.message} (${m.error.data ?? ""})`));
      else resolve(m.result);
      return;
    }
    if (m.method === "Runtime.exceptionThrown")
      errors.push(
        m.params.exceptionDetails.exception?.description ??
          m.params.exceptionDetails.text,
      );
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
      errors.push(
        m.params.args.map((a) => a.value ?? a.description ?? "").join(" "),
      );
    for (const w of [...waiters])
      if (w.method === m.method) w.resolve(m.params);
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const once = (method, timeout = 30_000) =>
    new Promise((resolve, reject) => {
      const w = {
        method,
        resolve: (p) => {
          waiters.splice(waiters.indexOf(w), 1);
          resolve(p);
        },
      };
      waiters.push(w);
      setTimeout(() => {
        const i = waiters.indexOf(w);
        if (i >= 0) {
          waiters.splice(i, 1);
          reject(new Error(`нет события ${method}`));
        }
      }, timeout);
    });

  const page = {
    send,
    errors,
    /** выполнить выражение в странице (await внутри можно), вернуть значение */
    async eval(expression) {
      const r = await send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (r.exceptionDetails)
        throw new Error(
          r.exceptionDetails.exception?.description ?? r.exceptionDetails.text,
        );
      return r.result.value;
    },
    /** ждать, пока выражение станет истинным */
    async waitFor(expression, timeout = 15_000) {
      const end = Date.now() + timeout;
      while (Date.now() < end) {
        if (await page.eval(expression).catch(() => false)) return;
        await sleep(50);
      }
      throw new Error(`не дождались: ${expression}`);
    },
    /** открыть адрес и дождаться, пока React оживит страницу (у меню появятся обработчики) */
    async goto(path) {
      const loaded = once("Page.loadEventFired");
      await send("Page.navigate", { url: BASE + path });
      await loaded;
      await page.hydrated();
    },
    async reload() {
      const loaded = once("Page.loadEventFired");
      await send("Page.reload");
      await loaded;
      await page.hydrated();
    },
    hydrated: () =>
      page.waitFor(
        `(() => { const el = document.querySelector('nav[aria-label="Основное меню"]'); return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps')); })()`,
      ),
    /** скрипт, который выполнится в начале каждого следующего документа (до разметки) */
    onNewDocument: (source) =>
      send("Page.addScriptToEvaluateOnNewDocument", { source }),
    /** центр видимого элемента, когда он перестал двигаться (два кадра на одном месте) — как в Playwright:
     *  иначе клик по меню, которое ещё выезжает, пришёлся бы мимо */
    async point(selector) {
      for (let i = 0; i < 200; i++) {
        const p = await page.eval(`new Promise((done) => {
          const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find((e) => e.checkVisibility());
          if (!el) return done(null);
          const a = el.getBoundingClientRect();
          requestAnimationFrame(() => requestAnimationFrame(() => {
            const b = el.getBoundingClientRect();
            const still = a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
            done(still ? [b.x + b.width / 2, b.y + b.height / 2] : "moving");
          }));
        })`);
        if (!p) throw new Error(`нет видимого элемента ${selector}`);
        if (p !== "moving") return p;
      }
      throw new Error(`элемент не перестаёт двигаться: ${selector}`);
    },
    /** настоящий клик мышью */
    async click(selector) {
      const [x, y] = await page.point(selector);
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
      for (const type of ["mousePressed", "mouseReleased"])
        await send("Input.dispatchMouseEvent", {
          type,
          x,
          y,
          button: "left",
          clickCount: 1,
        });
    },
    /** касание пальцем (вкладка открыта с mobile: true) */
    async tap(selector) {
      const [x, y] = await page.point(selector);
      await send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      await sleep(60);
      await send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    } /** прокрутка колесом — как пользователь */,
    async wheel(deltaY, times = 1) {
      for (let i = 0; i < times; i++) {
        await send("Input.dispatchMouseEvent", {
          type: "mouseWheel",
          x: 400,
          y: 300,
          deltaX: 0,
          deltaY,
        });
        await sleep(40);
      }
    },
    async key(key, code, keyCode, text) {
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key,
        code,
        windowsVirtualKeyCode: keyCode,
        text,
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key,
        code,
        windowsVirtualKeyCode: keyCode,
      });
    },
    type: (text) => send("Input.insertText", { text }),
    /** записывать значение выражения каждый кадр, ms миллисекунд; вернуть [{ t, v }] */
    async sample(expression, ms) {
      await page.eval(`(() => {
        window.__e2e = [];
        const t0 = performance.now();
        const tick = () => {
          const t = performance.now() - t0;
          try { window.__e2e.push({ t, v: (${expression}) }); } catch (e) { window.__e2e.push({ t, v: 'ERR ' + e.message }); }
          if (t < ${ms}) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })()`);
      return {
        /** забрать записи (дождавшись конца) */
        done: async () => {
          await sleep(ms + 100);
          return page.eval("window.__e2e");
        },
      };
    },
    close: async () => {
      ws.close();
      await page.closeTab?.();
    },
  };
  return page;
}

// ── выражения для страницы ────────────────────────────────────────────────

/** стекло нижнего меню, видимое */
export const NAV_GLASS = `document.querySelector('nav[aria-label="Основное меню"]')`;

/** прозрачность и фильтры у предков элемента: всё, что делает их «корнем» размытия для стекла */
export const backdropRootsAbove = (el) => `(() => {
  const roots = [];
  for (let n = (${el})?.parentElement; n && n !== document.documentElement; n = n.parentElement) {
    const s = getComputedStyle(n);
    if (+s.opacity < 1 || s.filter !== 'none' || s.clipPath !== 'none' || s.maskImage !== 'none' || s.mixBlendMode !== 'normal' || s.backdropFilter !== 'none')
      roots.push(n.tagName + '.' + String(n.className).slice(0, 40) + ' opacity=' + s.opacity + ' filter=' + s.filter);
  }
  return roots;
})()`;

/** видимые верхние узлы страниц (у спрятанных Next ставит display: none) */
export const VISIBLE_PAGES = `[...document.querySelectorAll('.route-enter > *')].filter((el) => el.checkVisibility())`;

// CHANGELOG.md → версии для вкладки «Обновления». Формат файла:
//   ## [0.2.0] — 2026-10-28      версия и дата (или ## [Unreleased] — то, что ещё не выпущено)
//   ### Добавлено                группа изменений
//   - пункт, может продолжаться на следующих строках с отступом
// Без React — проверяется тестом (changelog.test.ts).

export type Release = {
  version: string;
  date?: string;
  /** ещё не выпущено */
  unreleased: boolean;
  /** абзац сразу под заголовком версии */
  note?: string;
  groups: { title: string; items: string[] }[];
};

export function parseChangelog(text: string): Release[] {
  const releases: Release[] = [];
  let release: Release | undefined;
  let group: Release["groups"][number] | undefined;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const head = line.match(/^## \[([^\]]+)\](?:\s*[—-]\s*(.+))?/);
    if (head) {
      release = {
        version: head[1],
        date: head[2]?.trim(),
        unreleased: /unreleased/i.test(head[1]),
        groups: [],
      };
      group = undefined;
      releases.push(release);
      continue;
    }
    if (!release) continue;
    const sub = line.match(/^### (.+)/);
    if (sub) {
      group = { title: sub[1].trim(), items: [] };
      release.groups.push(group);
      continue;
    }
    const item = line.match(/^- (.+)/);
    if (item) {
      if (!group) {
        group = { title: "Изменения", items: [] };
        release.groups.push(group);
      }
      group.items.push(item[1]);
      continue;
    }
    // продолжение пункта на следующей строке
    if (/^\s+\S/.test(line) && group?.items.length) {
      group.items[group.items.length - 1] += ` ${line.trim()}`;
      continue;
    }
    if (line && !group && !line.startsWith("#"))
      release.note = release.note ? `${release.note} ${line}` : line;
  }
  return releases;
}

// кусок текста пункта: обычный, `код` или **жирный**
export type Part = { kind: "text" | "code" | "bold"; text: string };

export function inlineParts(text: string): Part[] {
  const parts: Part[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last)
      parts.push({ kind: "text", text: text.slice(last, m.index) });
    parts.push(
      m[1] !== undefined
        ? { kind: "code", text: m[1] }
        : { kind: "bold", text: m[2] },
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", text: text.slice(last) });
  return parts;
}

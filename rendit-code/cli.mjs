#!/usr/bin/env node
// Командная строка RenDit Code.
//
//   node rendit-code/cli.mjs build          — один раз собрать CSS
//   node rendit-code/cli.mjs watch          — собрать и следить за файлами
//   node rendit-code/cli.mjs dev [args]     — следить и параллельно запустить `next dev [args]`
//   node rendit-code/cli.mjs check <класс>  — показать CSS для классов (отладка)

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGenerator } from "./core/generator.mjs";
import { createEngine } from "./index.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [command = "build", ...args] = process.argv.slice(2);

const engine = await createEngine(ROOT);

switch (command) {
  case "build":
    await engine.build();
    break;

  case "watch":
    await engine.build();
    engine.watch();
    break;

  case "dev": {
    await engine.build();
    const stop = engine.watch();
    const require = createRequire(path.join(ROOT, "package.json"));
    const nextBin = require.resolve("next/dist/bin/next");
    const child = spawn(process.execPath, [nextBin, "dev", ...args], {
      cwd: ROOT,
      stdio: "inherit",
    });

    const shutdown = (signal) => {
      stop();
      if (!child.killed) child.kill(signal);
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    child.on("exit", (code) => {
      stop();
      process.exit(code ?? 0);
    });
    break;
  }

  case "check": {
    await engine.build();
    const { config } = engine;
    const generator = createGenerator(config.theme, config);
    const { css } = generator.generate(args);
    for (const c of args)
      if (!generator.isValid(c)) console.log(`✖ не утилита: ${c}`);
    console.log(css);
    break;
  }

  default:
    console.error(
      `Неизвестная команда: ${command}. Есть: build, watch, dev, check`,
    );
    process.exit(1);
}

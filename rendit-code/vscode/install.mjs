// Сборка и установка расширения RenDit Code IntelliSense: npm run rendit-code:vscode
// Упаковывает папку в .vsix (локальный @vscode/vsce из devDependencies корня — без скачивания
// при каждом запуске) и ставит в VS Code командой `code --install-extension`.

import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const vsix = path.join(dir, "rendit-code.vsix");
const run = (cmd) => execSync(cmd, { cwd: dir, stdio: "inherit" });

run(
  `npx --no-install vsce package --allow-missing-repository --skip-license --out "${vsix}"`,
);
run(`code --install-extension "${vsix}" --force`);
console.log(
  "✓ RenDit Code IntelliSense установлен. В VS Code: Ctrl+Shift+P → Developer: Reload Window",
);

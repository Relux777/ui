// Где взять RenDit UI: репозиторий, релизы на GitHub (архив и готовый CSS к каждой версии) и CDN jsDelivr
// (готовый CSS прямо в <link>, файл из репозитория на теге версии). Версия — из package.json.
// Как выпускается версия — RELEASING.md.

import { version } from "../../package.json";

export const REPO = "Relux777/ui";
export const VERSION = version;

export const REPO_URL = `https://github.com/${REPO}`;
export const RELEASES_URL = `${REPO_URL}/releases`;

// архив версии: движок, RenDit SCSS, конфиг и готовый CSS; latest — последняя версия
export const zipUrl = (v: string | "latest" = "latest") =>
  v === "latest"
    ? `${RELEASES_URL}/latest/download/rendit-ui.zip`
    : `${RELEASES_URL}/download/v${v}/rendit-ui.zip`;

// готовый CSS с CDN — подключается строкой <link>
export const cdnCss = (v: string = VERSION, min = true) =>
  `https://cdn.jsdelivr.net/gh/${REPO}@v${v}/dist/rendit-ui${min ? ".min" : ""}.css`;

// часть готового CSS (dist/modules: rendit-core, rendit-layout …) — с версии, где появились части
export const cdnModule = (file: string, min = true, v: string = VERSION) =>
  `https://cdn.jsdelivr.net/gh/${REPO}@v${v}/dist/modules/${file}${min ? ".min" : ""}.css`;

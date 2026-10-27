// PNG-иконка 192×192 для манифеста (Android: ярлык и установка). Отдельный адрес, а не icon1.tsx:
// иначе она попала бы в <link rel="icon"> и браузер мог бы взять её вместо фавикона icon.svg
import { appIcon } from "../_brand/app-icon";

export function GET() {
  return appIcon(192);
}

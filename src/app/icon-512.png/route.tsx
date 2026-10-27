// PNG-иконка 512×512 для манифеста (Android: экран запуска и maskable-иконка)
import { appIcon } from "../_brand/app-icon";

export function GET() {
  return appIcon(512);
}

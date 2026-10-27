// Иконка для iPhone/iPad («На экран Домой»): белый знак на чёрной плитке, 180×180.
import { appIcon } from "./_brand/app-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return appIcon(size.width);
}

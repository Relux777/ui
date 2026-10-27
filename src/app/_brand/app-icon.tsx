// Иконка приложения: белый знак «Layers» на чёрной плитке во весь квадрат. Знак занимает 62 % —
// внутри безопасной зоны maskable-иконок Android (круг 80 %), поэтому плитку можно обрезать любой формой.
// Её рисуют apple-icon.tsx (iPhone, 180) и icon-192.png / icon-512.png (манифест, Android).
import { ImageResponse } from "next/og";

// форма знака — как в src/assets/svg/Rendit_UI_logo.svg
const MARK_PATHS = {
  top: "M24 7 41 15.5 24 24 7 15.5z",
  middle: "m7 24.5 17 8.5 17-8.5",
  bottom: "m7 33 17 8.5L41 33",
};

export function appIcon(px: number) {
  const mark = Math.round(px * 0.62);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
      }}
    >
      <svg
        role="img"
        aria-label="RenDit UI"
        viewBox="0 0 48 48"
        width={mark}
        height={mark}
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={MARK_PATHS.top} fill="#fff" strokeWidth="3" />
        <path d={MARK_PATHS.middle} strokeWidth="4" opacity="0.6" />
        <path d={MARK_PATHS.bottom} strokeWidth="4" opacity="0.3" />
      </svg>
    </div>,
    { width: px, height: px },
  );
}

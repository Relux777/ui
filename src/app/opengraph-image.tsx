// Превью ссылки в соцсетях и мессенджерах (1200×630): знак, название и подпись в стиле boxicons.
import { ImageResponse } from "next/og";

// форма знака — как в src/assets/svg/Rendit_UI_logo.svg
const MARK_PATHS = {
  top: "M24 7 41 15.5 24 24 7 15.5z",
  middle: "m7 24.5 17 8.5 17-8.5",
  bottom: "m7 33 17 8.5L41 33",
};

export const alt = "RenDit UI — свой UI-фреймворк: классы, токены и компоненты";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#fff",
        color: "#111",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg
          role="img"
          aria-label="RenDit UI"
          viewBox="0 0 48 48"
          width="96"
          height="96"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={MARK_PATHS.top} fill="#111" strokeWidth="3" />
          <path d={MARK_PATHS.middle} strokeWidth="4" opacity="0.6" />
          <path d={MARK_PATHS.bottom} strokeWidth="4" opacity="0.3" />
        </svg>
        <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>
          RenDit UI
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.1,
          }}
        >
          Классы, токены и компоненты — всё своё
        </span>
        <span
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "8px 20px",
            borderRadius: 999,
            background: "#c6fe2b",
            fontSize: 28,
          }}
        >
          RenDit SCSS · RenDit Code
        </span>
      </div>
    </div>,
    size,
  );
}

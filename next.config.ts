import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy: скрипты, стили, шрифты, картинки и запросы — только со своего адреса,
// сайт нельзя встроить в чужой <iframe> (кликджекинг), плагины и <base> запрещены.
// 'unsafe-inline' у скриптов — для встроенного скрипта темы (next-themes) и данных Next: строгий CSP с nonce
// сделал бы все страницы динамическими. В dev — ещё 'unsafe-eval' и WebSocket горячей перезагрузки.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // только HTTPS на год вперёд; по http браузеры заголовок игнорируют
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // без заголовка X-Powered-By: Next.js — меньше подсказок о том, на чём сделан сайт
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/assets/scss")],
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              // svgo по умолчанию удаляет viewBox, если он совпадает с width/height (иконки Boxicons 24×24) —
              // тогда иконка, выведенная в другом размере (14, 16, 22 px), обрезается, а не масштабируется.
              // prefixIds — как в конфиге SVGR по умолчанию (уникальные id внутри SVG, напр. у card-qr)
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: { overrides: { removeViewBox: false } },
                  },
                  "prefixIds",
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;

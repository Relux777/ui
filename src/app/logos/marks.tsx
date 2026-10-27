// Варианты логотипа RenDit UI. Все — SVG 48×48.
// Основной цвет — currentColor: логотип сам становится чёрным на светлом и белым на тёмном
// (цвет задаётся классом text-…). Акценты — фирменные: лайм #c6fe2b и градиент #ed70a7 → #f7ae49.
//
// id нужен маскам и градиентам: на странице один логотип выводится несколько раз,
// а id в документе должны быть уникальными.

import type { ReactNode } from "react";

const LIME = "#c6fe2b";
const PINK = "#ed70a7";

type Mark = { name: string; idea: string; render: (id: string) => ReactNode };

// R из линий — вырезается маской из фигуры
const R_PATH = "M18 34V14h7a6 6 0 0 1 0 12h-7m6 0 7 8";

function BrandGradient({
  id,
  x1 = 6,
  y1 = 6,
  x2 = 42,
  y2 = 42,
}: {
  id: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}) {
  return (
    <linearGradient
      id={id}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#ed70a7" />
      <stop offset="0.5" stopColor="#f7a18d" />
      <stop offset="1" stopColor="#f7ae49" />
    </linearGradient>
  );
}

function CutR({
  id,
  d = R_PATH,
  width = 4.5,
}: {
  id: string;
  d?: string;
  width?: number;
}) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
      <rect width="48" height="48" fill="#fff" />
      <path
        d={d}
        fill="none"
        stroke="#000"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </mask>
  );
}

export const MARKS: Mark[] = [
  {
    name: "Box R",
    idea: "Скруглённый квадрат с вырезанной R — ближе всего к знаку boxicons",
    render: (id) => (
      <>
        <defs>
          <CutR id={`${id}-m`} />
        </defs>
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="12"
          fill="currentColor"
          mask={`url(#${id}-m)`}
        />
      </>
    ),
  },
  {
    name: "Hex R",
    idea: "Шестигранник-«коробка» со скруглёнными углами и R",
    render: (id) => (
      <>
        <defs>
          <CutR
            id={`${id}-m`}
            d="M19.5 32V16h6a5 5 0 0 1 0 10h-6m5 0 6 6"
            width={4}
          />
        </defs>
        <path
          d="M24 6.5 39.2 15.25v17.5L24 41.5 8.8 32.75v-17.5z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
          mask={`url(#${id}-m)`}
        />
      </>
    ),
  },
  {
    name: "Cube",
    idea: "Изометрический куб: UI собирается из блоков, одна грань — акцент",
    render: () => (
      <g strokeLinejoin="round" strokeWidth="2">
        <path
          d="M24 6.5 39 15 24 23.5 9 15z"
          fill="currentColor"
          stroke="currentColor"
        />
        <path
          d="M8 18.5 22.5 26.7v15L8 33.5z"
          fill="currentColor"
          stroke="currentColor"
          opacity="0.55"
        />
        <path d="M40 18.5 25.5 26.7v15L40 33.5z" fill={LIME} stroke={LIME} />
      </g>
    ),
  },
  {
    name: "Layers",
    idea: "Слои каскада — theme, base, utilities — стопкой",
    render: () => (
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M24 7 41 15.5 24 24 7 15.5z"
          fill="currentColor"
          strokeWidth="3"
        />
        <path
          d="m7 24.5 17 8.5 17-8.5"
          fill="none"
          strokeWidth="4"
          opacity="0.6"
        />
        <path
          d="m7 33 17 8.5L41 33"
          fill="none"
          strokeWidth="4"
          opacity="0.3"
        />
      </g>
    ),
  },
  {
    name: "Blocks",
    idea: "Конструктор 2×2: квадраты, круг и акцентный блок",
    render: () => (
      <>
        <rect x="6" y="6" width="16" height="16" rx="5" fill="currentColor" />
        <circle cx="34" cy="14" r="8" fill="currentColor" />
        <rect
          x="6"
          y="26"
          width="16"
          height="16"
          rx="5"
          fill="currentColor"
          opacity="0.35"
        />
        <rect x="26" y="26" width="16" height="16" rx="5" fill={LIME} />
      </>
    ),
  },
  {
    name: "Solid R",
    idea: "Плотная геометрическая R из трёх фигур",
    render: () => (
      <g fill="currentColor">
        <rect x="10" y="6" width="9" height="36" rx="3" />
        <path
          fillRule="evenodd"
          d="M19 6h9a11 11 0 0 1 0 22h-9zm0 7h8.5a4 4 0 0 1 0 8H19z"
        />
        <path
          d="M23.5 28h9l7.5 14h-9z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    ),
  },
  {
    name: "Code R",
    idea: "R в угловых скобках — фреймворк для кода",
    render: () => (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 15 5 24l8 9" />
        <path d="m35 15 8 9-8 9" />
        <path d="M19.5 33V15H25a4.75 4.75 0 0 1 0 9.5h-5.5m5 0 5 8.5" />
      </g>
    ),
  },
  {
    name: "Outline R",
    idea: "Контурный квадрат, R и розовая точка",
    render: () => (
      <>
        <rect
          x="5.5"
          y="5.5"
          width="37"
          height="37"
          rx="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          d="M17 33V15h7a5.5 5.5 0 0 1 0 11h-7m6 0 6.5 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="34.5" cy="33" r="2.75" fill={PINK} />
      </>
    ),
  },
  {
    name: "Cards",
    idea: "Стопка карточек-компонентов",
    render: () => (
      <g fill="currentColor">
        <rect x="16" y="6" width="26" height="20" rx="6" opacity="0.25" />
        <rect x="11" y="13" width="26" height="20" rx="6" opacity="0.55" />
        <rect x="6" y="20" width="26" height="20" rx="6" />
      </g>
    ),
  },
  {
    name: "Ribbon R",
    idea: "R одной линией с плавной ножкой, фирменный градиент",
    render: (id) => (
      <>
        <defs>
          <BrandGradient id={`${id}-g`} x1={14} y1={10} x2={36} y2={39} />
        </defs>
        <path
          d="M15 39V10h11a8.5 8.5 0 0 1 0 17H15m11 0c5.5 0 8.5 4 9.5 12"
          fill="none"
          stroke={`url(#${id}-g)`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    name: "Toggle",
    idea: "Переключатель — самый узнаваемый символ интерфейса",
    render: (id) => (
      <>
        <defs>
          <mask
            id={`${id}-m`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="48"
            height="48"
          >
            <rect width="48" height="48" fill="#fff" />
            <circle cx="33" cy="24" r="8.5" fill="#000" />
          </mask>
        </defs>
        <rect
          x="4"
          y="13"
          width="40"
          height="22"
          rx="11"
          fill="currentColor"
          mask={`url(#${id}-m)`}
        />
        <circle cx="33" cy="24" r="6.5" fill={LIME} />
      </>
    ),
  },
  {
    name: "Spark",
    idea: "Четырёхлучевая искра в градиенте — лёгкий, «живой» знак",
    render: (id) => (
      <>
        <defs>
          <BrandGradient id={`${id}-g`} />
        </defs>
        <path
          d="M24 4c1.6 11.6 8.4 18.4 20 20-11.6 1.6-18.4 8.4-20 20-1.6-11.6-8.4-18.4-20-20 11.6-1.6 18.4-8.4 20-20z"
          fill={`url(#${id}-g)`}
        />
      </>
    ),
  },
  {
    name: "Hex Core",
    idea: "Шестигранник в шестиграннике: ядро и оболочка",
    render: () => (
      <>
        <path
          d="M24 5.5 40 14.75v18.5L24 42.5 8 33.25v-18.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="m24 15.5 7.4 4.25v8.5L24 32.5l-7.4-4.25v-8.5z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    name: "Window",
    idea: "Окно приложения с блоками интерфейса внутри",
    render: () => (
      <>
        <rect
          x="5.5"
          y="8.5"
          width="37"
          height="31"
          rx="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <g fill="currentColor">
          <circle cx="12" cy="15.5" r="1.75" />
          <circle cx="17.5" cy="15.5" r="1.75" />
          <circle cx="23" cy="15.5" r="1.75" />
          <rect x="11.5" y="21.5" width="11" height="11" rx="3" />
          <rect x="26" y="21.5" width="10.5" height="4" rx="2" />
          <rect x="26" y="28.5" width="7" height="4" rx="2" opacity="0.5" />
        </g>
      </>
    ),
  },
  {
    name: "Bauhaus R",
    idea: "R из трёх цветных фигур: столб, полукруг, треугольник",
    render: (id) => (
      <>
        <defs>
          <BrandGradient id={`${id}-g`} x1={19} y1={6} x2={35} y2={28} />
        </defs>
        <rect x="9" y="6" width="10" height="36" rx="2.5" fill="currentColor" />
        <path d="M19 6h5a11 11 0 0 1 0 22h-5z" fill={`url(#${id}-g)`} />
        <path
          d="M21.5 28h10l9 14h-10z"
          fill={LIME}
          stroke={LIME}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    name: "Gradient R",
    idea: "Градиентная плитка с белой R — как иконка приложения",
    render: (id) => (
      <>
        <defs>
          <BrandGradient id={`${id}-g`} />
        </defs>
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="13"
          fill={`url(#${id}-g)`}
        />
        <path
          d={R_PATH}
          fill="none"
          stroke="#fff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    name: "Line Cube",
    idea: "Контурный куб в стиле линейных иконок boxicons",
    render: () => (
      <path
        d="M24 5 41 14.5v19L24 43 7 33.5v-19zM7 14.5 24 24l17-9.5M24 24v19"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Circle R",
    idea: "Круг с вырезанной R — спокойный, хорошо читается в маленьком размере",
    render: (id) => (
      <>
        <defs>
          <CutR
            id={`${id}-m`}
            d="M18.5 33V15h6.5a5.75 5.75 0 0 1 0 11.5h-6.5m6 0 6.5 6.5"
          />
        </defs>
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="currentColor"
          mask={`url(#${id}-m)`}
        />
      </>
    ),
  },
];

export function LogoMark({
  index,
  id,
  size = 48,
  className,
}: {
  index: number;
  id: string;
  size?: number;
  className?: string;
}) {
  const mark = MARKS[index];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`RenDit UI — ${mark.name}`}
    >
      {mark.render(id)}
    </svg>
  );
}

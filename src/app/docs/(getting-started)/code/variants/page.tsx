// Варианты RenDit Code: брейкпоинты (mobile-first) и все группы префиксов.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Code, DocHeader, Heading, Lead, Table } from "../../../../_docs/docs";

export const metadata: Metadata = { title: "Варианты" };

const SCREENS: ReactNode[][] = [
  [<Code key="k">sm:</Code>, "от 620px", "большие телефоны, телефон боком"],
  [<Code key="k">md:</Code>, "от 770px", "планшеты"],
  [<Code key="k">lg:</Code>, "от 990px", "ноутбуки, планшет боком"],
  [<Code key="k">xl:</Code>, "от 1200px", "компьютеры"],
  [<Code key="k">2xl:</Code>, "от 1400px", "большие экраны"],
];

const GROUPS: ReactNode[][] = [
  [
    "Состояния",
    "hover: (только мышь), focus:, focus-visible:, focus-within:, active:, disabled:, checked:, invalid:, placeholder-shown:, first:, last:, odd:, even:, empty:, open:",
  ],
  [
    "Брейкпоинты",
    "sm: md: lg: xl: 2xl: — от ширины и больше; max-md: — меньше; min-[500px]:, max-[500px]:",
  ],
  [
    "Контейнер",
    "@xs: … @2xl: — ширина родителя с классом @container; @max-md:, @[500px]:",
  ],
  [
    "Тема и среда",
    "dark:, touch: (сенсорные экраны), mouse:, motion-reduce:, motion-safe:, print:, portrait:, landscape:, rtl:, ltr:",
  ],
  [
    "Связи",
    "group-hover:, group-hover/имя:, group-[.is-open]:, peer-checked:, has-checked:, has-[>img]:, not-first:, *: (дети)",
  ],
  [
    "Атрибуты",
    "aria-expanded:, aria-[sort=asc]:, data-active:, data-[state=open]:",
  ],
  [
    "Псевдоэлементы",
    "before:, after: (content подставляется сам), placeholder:, file:, marker:, selection:",
  ],
  [
    "Произвольные",
    "[&>svg]:, [&:nth-child(3)]:, supports-[display:grid]:, nth-3:",
  ],
];

export default function VariantsPage() {
  return (
    <>
      <DocHeader
        path={["RenDit Code", "Варианты"]}
        title="Варианты"
        lead={
          <>
            Префикс перед классом — когда он действует: <Code>md:p-24</Code>,{" "}
            <Code>hover:bg-primary-hover</Code>, <Code>dark:shadow-none</Code>.
            Порядок в CSS считает движок: <Code>md:</Code> всегда перебивает
            класс без префикса, <Code>active:</Code> — <Code>hover:</Code>.
          </>
        }
      />

      <section className="flex flex-col gap-14">
        <Heading id="screens">Брейкпоинты</Heading>
        <Lead>
          Mobile-first: класс без префикса — для всех экранов,{" "}
          <Code>md:p-24</Code> — от 770px и шире, <Code>max-md:hidden</Code> —
          уже 770px. Те же границы у миксинов <Code>up()</Code> и{" "}
          <Code>down()</Code> в SCSS, а поменять их можно в конфиге.
        </Lead>
        <Table head={["Префикс", "Ширина", "Обычно"]} rows={SCREENS} />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="groups">Все варианты</Heading>
        <Lead>
          Варианты складываются: <Code>md:hover:bg-primary/50</Code> — наведение
          мышью на экранах от 770px.
        </Lead>
        <Table head={["Группа", "Префиксы"]} rows={GROUPS} />
      </section>
    </>
  );
}

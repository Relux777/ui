// Пропорции: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — обложки карточек, видео,
// аватары, свои пропорции и как считается размер с полями и рамкой (box-border / box-content).

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { AspectBuilder } from "./_builder";
import { ASPECT_CLASSES } from "./_classes";

const HREF = "/docs/scss/aspect";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "covers", title: "Обложки карточек" },
  { id: "video", title: "Видео" },
  { id: "custom", title: "Свои пропорции" },
  { id: "sizing", title: "Поля и рамка" },
];

const COVER =
  "bg-[linear-gradient(135deg,var(--violet-400),var(--pink-400)_60%,var(--orange-300))]";

export default async function AspectPage() {
  const css = await classCss(ASPECT_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>aspect-video</Code> — 16 : 9, <Code>aspect-square</Code> —
          квадрат: задаёте ширину, высота считается сама. Обложки карточек
          одинаковые, даже если картинки разные.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите пропорции и ширину — над примером настоящий размер. Включите поля и рамку, чтобы увидеть разницу box-border и box-content."
        className="relative z-1"
      >
        <AspectBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Любая дробь — классом: <Code>aspect-4/3</Code>,{" "}
            <Code>aspect-9/16</Code>; что угодно ещё — в скобках.
          </>
        }
      >
        <ClassTable
          rows={[
            ["aspect-square", "квадрат: аватары, иконки, плитки"],
            ["aspect-video", "16 : 9 — видео и обложки"],
            ["aspect-4/3", "фото"],
            ["aspect-3/4", "портрет, обложка книги"],
            ["aspect-9/16", "вертикальное видео, сторис"],
            ["aspect-[21/9]", "широкий баннер — своё значение"],
            ["aspect-auto", "как у картинки (по умолчанию)"],
            ["box-border", "поля и рамка внутри ширины — так в RenDit SCSS"],
            ["box-content", "поля и рамка прибавляются к ширине"],
          ]}
        />
      </Part>

      <Part
        id="covers"
        title="Обложки карточек"
        lead={
          <>
            <Code>aspect-video</Code> + <Code>object-cover</Code> у картинки:
            обложки одной высоты, картинка обрезается по краям, а не
            сплющивается.
          </>
        }
      >
        <Example
          title="aspect-video object-cover"
          code={`<img class="w-full aspect-video object-cover br-lg" src="…" alt="…">`}
        >
          <div className="grid sm:grid-cols-3 gap-12">
            {["Первая", "Вторая", "Третья"].map((t) => (
              <div key={t} className="flex flex-col gap-8">
                <span className={`w-full aspect-video br-lg ${COVER}`} />
                <span className="font-13 font-w-600">{t} карточка</span>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="video"
        title="Видео"
        lead={
          <>
            У <Code>&lt;iframe&gt;</Code> своей высоты нет: <Code>w-full</Code>{" "}
            + <Code>aspect-video</Code> — и плеер YouTube подстраивается под
            ширину без чёрных полос.
          </>
        }
      >
        <Example
          title="w-full aspect-video у iframe"
          code={`<iframe class="w-full aspect-video br-xl" src="https://www.youtube.com/embed/…"></iframe>`}
        >
          <div className="w-full aspect-video br-xl bg-gray-900 grid place-items-center">
            <span className="size-56 br-full bg-white/90 grid place-items-center pl-4 font-20 text-gray-900">
              ▶
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="custom"
        title="Свои пропорции"
        lead={
          <>
            <Code>aspect-9/16</Code> — сторис, <Code>aspect-[21/9]</Code> —
            широкий баннер, <Code>aspect-square</Code> — плитка галереи.
          </>
        }
      >
        <Example
          title="aspect-9/16, aspect-square, aspect-[21/9]"
          code={`<div class="aspect-9/16">  <div class="aspect-square">  <div class="aspect-[21/9]">`}
        >
          <div className="flex items-end gap-12">
            <span className={`w-72 aspect-9/16 br-lg ${COVER}`} />
            <span className={`w-120 aspect-square br-lg ${COVER}`} />
            <span className={`flex-1 aspect-[21/9] br-lg ${COVER}`} />
          </div>
        </Example>
      </Part>

      <Part
        id="sizing"
        title="Поля и рамка"
        lead={
          <>
            В RenDit SCSS у всех элементов <Code>box-border</Code>:{" "}
            <Code>w-200</Code> — это 200px вместе с полями и рамкой. С{" "}
            <Code>box-content</Code> поля и рамка прибавляются сверху.
          </>
        }
      >
        <Example
          title="w-200 p-16 border-6: box-border и box-content"
          code={`<div class="w-200 p-16 border-6 box-border">  <div class="w-200 p-16 border-6 box-content">`}
        >
          <div className="flex flex-col gap-10 font-12 font-w-600">
            <div className="w-200 p-16 border-6 border-blue-300 box-border br-lg bg-blue-500 text-white">
              box-border: 200px
            </div>
            <div className="w-200 p-16 border-6 border-blue-300 box-content br-lg bg-blue-500 text-white">
              box-content: 200 + 32 + 12 = 244px
            </div>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}

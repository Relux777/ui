// Картинки и видео: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — аватары и обложки
// (cover), логотипы и товары (contain), лицо не обрезается ([object-position:top]), видео.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ObjectBuilder } from "./_builder";
import { OBJECT_CLASSES } from "./_classes";

const HREF = "/docs/scss/object";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "cover", title: "Аватары и обложки" },
  { id: "contain", title: "Логотипы и товары" },
  { id: "position", title: "Что не обрезать" },
];

const IMG = "/samples/landscape.svg";

export default async function ObjectPage() {
  const css = await classCss(OBJECT_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Картинка не в своих пропорциях: <Code>object-cover</Code> — заполнить
          рамку и обрезать лишнее, <Code>object-contain</Code> — показать
          целиком. Для <Code>&lt;img&gt;</Code> и <Code>&lt;video&gt;</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Картинка 3 : 2 в квадратной или вертикальной рамке: выберите, как её вписать и какую часть сохранить при обрезке."
        className="relative z-1"
      >
        <ObjectBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["object-cover", "заполнить, лишнее обрезать"],
            ["object-contain", "целиком, с полями"],
            ["object-fill", "растянуть (ломает пропорции)"],
            ["object-none", "своего размера"],
            ["object-scale-down", "целиком, но не крупнее своего размера"],
            ["object-center", "при обрезке — середина (по умолчанию)"],
            ["[object-position:top]", "при обрезке — верх (лица на фото)"],
          ]}
        />
      </Part>

      <Part
        id="cover"
        title="Аватары и обложки"
        lead={
          <>
            Рамка задаёт форму (<Code>size-56 br-full</Code>,{" "}
            <Code>aspect-video</Code>), <Code>object-cover</Code> — картинка
            заполняет её без искажений, какой бы ни была исходная.
          </>
        }
      >
        <Example
          title="size-56 br-full object-cover и aspect-video object-cover"
          code={`<img class="size-56 br-full object-cover" …>
<img class="w-full aspect-video object-cover br-lg" …>`}
        >
          <div className="flex items-center gap-14">
            {/* biome-ignore lint/performance/noImgElement: пример — обычный <img> */}
            <img
              src={IMG}
              alt="Аватар"
              className="size-56 br-full object-cover"
            />
            {/* biome-ignore lint/performance/noImgElement: пример — обычный <img> */}
            <img
              src={IMG}
              alt="Обложка"
              className="w-200 aspect-video object-cover br-lg"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="contain"
        title="Логотипы и товары"
        lead={
          <>
            Товар нельзя обрезать — <Code>object-contain</Code>: целиком, по
            центру рамки, а поля заливает фон карточки.
          </>
        }
      >
        <Example
          title="aspect-square object-contain"
          code={`<img class="aspect-square object-contain bg-surface-muted p-12" …>`}
        >
          <div className="grid grid-cols-3 gap-10 max-w-420">
            {["object-cover", "object-contain", "object-fill"].map((fit) => (
              <figure key={fit} className="flex flex-col gap-6">
                {/* biome-ignore lint/performance/noImgElement: пример — обычный <img> */}
                <img
                  src={IMG}
                  alt=""
                  className={`w-full aspect-square br-lg bg-surface-muted border ${fit}`}
                />
                <figcaption className="font-11 font-mono text-foreground-muted">
                  {fit}
                </figcaption>
              </figure>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="position"
        title="Что не обрезать"
        lead={
          <>
            По умолчанию <Code>object-cover</Code> оставляет середину. На фото
            людей важнее верх — <Code>[object-position:top]</Code>, у пейзажа —
            низ.
          </>
        }
      >
        <Example
          title="object-cover и разные object-position"
          code={`<img class="object-cover [object-position:top]" …>`}
        >
          <div className="grid grid-cols-3 gap-10 max-w-420">
            {[
              "[object-position:top]",
              "object-center",
              "[object-position:bottom]",
            ].map((pos) => (
              <figure key={pos} className="flex flex-col gap-6">
                {/* biome-ignore lint/performance/noImgElement: пример — обычный <img> */}
                <img
                  src={IMG}
                  alt=""
                  className={`w-full aspect-3/4 br-lg object-cover ${pos}`}
                />
                <figcaption className="font-11 font-mono text-foreground-muted">
                  {pos}
                </figcaption>
              </figure>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}

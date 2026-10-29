"use client";

// Конструктор позиции: метка внутри карточки, а карточка — в прокручиваемом блоке. Меняйте position метки,
// куда ей встать и есть ли у карточки relative — видно, от чего считаются смещения. Прокрутите блок: sticky
// прилипает, fixed стоит на месте. fixed здесь держится примера, а не окна — у холста transform (так
// работает и в жизни: transform у предка делает его опорой для fixed).

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  classOptions,
  Field,
  Output,
  Seg,
  Switch,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { PLACES, type Place, POSITIONS } from "./_classes";

const NOTES: Record<string, string> = {
  static: "Обычный поток: смещения top/left не действуют.",
  relative:
    "Остаётся на своём месте в потоке, смещения сдвигают его от этого места. Главное — становится опорой для absolute внутри.",
  absolute:
    "Вынут из потока, смещения — от ближайшего предка с relative (или absolute, fixed, sticky).",
  fixed: "Вынут из потока, смещения — от окна: не уезжает при прокрутке.",
  sticky:
    "Едет с потоком, пока не упрётся в top — дальше прилипает. Прокрутите блок.",
};

const LINE = "h-8 br-full bg-foreground/10";
// строки-заполнители под карточкой: есть что прокручивать
const FILLER = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"];

export function PositionBuilder({ css }: { css: CssMap }) {
  const [position, setPosition] = useState("absolute");
  const [place, setPlace] = useState<Place>("top-8 right-8");
  const [relative, setRelative] = useState(true);

  const classes = [position, ...place.split(" ")];

  return (
    <Builder
      controls={
        <>
          <Field label="Позиция метки" note={position}>
            <Seg
              value={position}
              options={classOptions(POSITIONS)}
              onChange={setPosition}
            />
          </Field>
          <Field label="Куда встать" note={place}>
            <Seg value={place} options={PLACES} onChange={setPlace} />
          </Field>
          <Switch checked={relative} onChange={setRelative}>
            У карточки relative
          </Switch>
          <p className="font-13 text-foreground-muted">{NOTES[position]}</p>
        </>
      }
      preview={
        <Canvas className="p-0! [transform:translateZ(0)]">
          <ClassStyle css={css} classes={classes} />
          <div className="h-260 overflow-y-auto overscroll-contain p-16 flex flex-col gap-10">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`${LINE} ${n === 2 ? "w-2/3" : "w-full"}`}
              />
            ))}
            <div
              className={`${relative ? "relative" : ""} shrink-0 flex flex-col gap-8 p-16 min-h-140 br-lg border-2 border-dashed border-blue-400 bg-blue-500/8`}
            >
              <span className="font-12 font-w-600 text-blue-600">
                Карточка {relative ? "· relative" : ""}
              </span>
              <span className={`${LINE} w-3/4`} />
              <span
                className={`${classes.join(" ")} self-start grid place-items-center px-10 py-4 br-full bg-pink-500 text-white font-12 font-w-700 z-1`}
              >
                Метка
              </span>
              <span className={`${LINE} w-1/2`} />
            </div>
            {FILLER.map((id, n) => (
              <span
                key={id}
                className={`${LINE} ${n % 2 ? "w-4/5" : "w-full"}`}
              />
            ))}
          </div>
        </Canvas>
      }
      output={<Output classes={classes} css={css} tag="span" inner="Метка" />}
    />
  );
}

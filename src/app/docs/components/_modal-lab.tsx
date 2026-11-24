"use client";

// Конструктор «Окна»: позиция на компьютере и на телефоне, класс фона окна, живое превью в рамке
// (Modal inline — окно внутри рамки: своя затемнённая подложка, клик мимо окна закрывает) и page.tsx.
// Класс фона — как в page.tsx: пишите любой класс RenDit Code (bg-primary, bg-secondary, bg-accent…),
// он уходит на окно через className.

import { useRef, useState } from "react";
import {
  Modal,
  type ModalHandle,
  type ModalPosition,
} from "@/components/ui/Modal";
import { Content1 } from "@/components/ui/Modal/content/content_1";
import { Field, Seg } from "../../_docs/builder";
import { ComponentLab } from "./_lab";

const POSITIONS = [
  { id: "center", title: "По центру" },
  { id: "right", title: "Справа" },
  { id: "left", title: "Слева" },
  { id: "bottom", title: "Снизу" },
] as const;

const PHONE_POSITIONS = [
  { id: "bottom", title: "Снизу" },
  { id: "center", title: "По центру" },
  { id: "right", title: "Справа" },
  { id: "left", title: "Слева" },
] as const;

const OPEN_BUTTON =
  "h-40 px-16 br-full bg-primary text-primary-foreground font-13 font-w-600 transition hover:opacity-85 active:scale-97";
const TEXT_INPUT =
  "w-full h-36 px-10 br-md border bg-surface font-16 outline-none placeholder:text-foreground-muted focus:border-secondary";

export function ModalLab() {
  const [position, setPosition] = useState<ModalPosition>("center");
  const [phone, setPhone] = useState<ModalPosition>("bottom");
  const [bg, setBg] = useState("");
  const ref = useRef<ModalHandle>(null);

  const bgClass = bg.trim();
  const code = `import { useRef } from "react";
import { Modal, type ModalHandle } from "@/components/ui/Modal";
import { Content1 } from "@/components/ui/Modal/content/content_1";

export default function Page() {
  const ref = useRef<ModalHandle>(null);
  return (
    <>
      <button onClick={() => ref.current?.open()}>Открыть окно</button>
      <Modal
        ref={ref}
        title="Удалить файл?"
        position="${position}"
        phone="${phone}"${bgClass ? `\n        className="${bgClass}"` : ""}
      >
        <Content1 />
      </Modal>
    </>
  );
}`;

  return (
    <ComponentLab
      controls={
        <>
          <Field label="Позиция">
            <Seg value={position} options={POSITIONS} onChange={setPosition} />
          </Field>
          <Field label="На телефоне">
            <Seg value={phone} options={PHONE_POSITIONS} onChange={setPhone} />
          </Field>
          <Field label="Класс фона окна">
            <input
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              placeholder="bg-primary"
              aria-label="Класс фона окна"
              className={TEXT_INPUT}
            />
          </Field>
        </>
      }
      preview={
        <div className="relative w-full h-340 br-lg border bg-foreground/5 grid place-items-center overflow-hidden">
          <button
            type="button"
            onClick={() => ref.current?.open()}
            className={OPEN_BUTTON}
          >
            Открыть окно
          </button>
          <Modal
            ref={ref}
            inline
            title="Удалить файл?"
            position={position}
            phone={phone}
            className={bgClass}
          >
            <Content1 />
          </Modal>
        </div>
      }
      code={code}
    />
  );
}

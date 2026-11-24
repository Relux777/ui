"use client";

// Живой пример окна на серверной странице: кнопка открывает Modal через ref, контент — обычный
// ReactNode (серверная страница не может передавать функции через границу). Кнопки контента
// закрывают окно хуком useModalClose() — пропсы не нужны.

import { type ReactNode, useRef } from "react";
import {
  Modal,
  type ModalHandle,
  type ModalPosition,
} from "@/components/ui/Modal";

const BUTTON =
  "h-40 px-16 br-full bg-primary text-primary-foreground font-13 font-w-600 transition hover:opacity-85 active:scale-97";

export function ModalDemo({
  position,
  phone,
  title,
  subtitle,
  button,
  buttonClassName = "",
  children,
}: {
  position?: ModalPosition;
  phone?: ModalPosition;
  title: string;
  subtitle?: ReactNode;
  button: string;
  buttonClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<ModalHandle>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.open()}
        className={`${BUTTON} ${buttonClassName}`}
      >
        {button}
      </button>
      <Modal
        ref={ref}
        title={title}
        subtitle={subtitle}
        position={position}
        phone={phone}
      >
        {children}
      </Modal>
    </>
  );
}

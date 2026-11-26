"use client";

// Кнопка, которая открывает модальное окно. Модалка живёт в отдельном клиентском файле, потому что
// onClick и ref не пересекают границу сервер → клиент: страница или шапка остаются серверными, а этот
// «островок» держит и кнопку, и окно целиком.
//
// Контент передаётся как children — разметку через границу передавать можно (функции нельзя), поэтому
//   <ModalTrigger title="…" buttonClassName="…"><Content1 /></ModalTrigger>
// работает прямо из серверного компонента, без "use client" в page.tsx.
// Кнопки контента закрывают окно хуком useModalClose(), как обычно.

import { type ReactNode, useRef } from "react";
import { Modal, type ModalHandle, type ModalPosition } from "./index";

export function ModalTrigger({
  title,
  subtitle,
  position = "center",
  phone,
  button = "Открыть",
  buttonClassName = "",
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  position?: ModalPosition;
  phone?: ModalPosition;
  /** подпись или содержимое кнопки */
  button?: ReactNode;
  /** классы кнопки: форма, цвет, размер — как у обычной кнопки */
  buttonClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<ModalHandle>(null);
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => ref.current?.open()}
        className={buttonClassName}
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

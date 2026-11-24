"use client";

// Содержимое модалки №1 — подтверждение действия: текст и две кнопки.
// Контенты лежат рядом с окном и закрывают его хуком useModalClose() — без пропсов:
// <Modal ...><Content1 /></Modal>. Вне окна close — пустое действие.

import { useModalClose } from "..";

export function Content1() {
  const close = useModalClose();
  return (
    <div className="flex flex-col gap-16">
      <p className="font-14 text-foreground-muted leading-1.5">
        Файл «Отчёт за июнь.pdf» будет удалён безвозвратно. Это действие нельзя
        отменить.
      </p>
      <div className="flex items-center justify-end gap-8">
        <button
          type="button"
          onClick={close}
          className="h-40 px-16 br-full border bg-surface font-13 font-w-600 transition hover:bg-surface-muted active:scale-97"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={close}
          className="h-40 px-16 br-full bg-danger text-white font-13 font-w-600 transition active:scale-97"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

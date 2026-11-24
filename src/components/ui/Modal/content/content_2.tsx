"use client";

// Содержимое модалки №2 — небольшая форма: в контент можно класть любые компоненты RenDit UI,
// здесь — Input. Кнопка «Сохранить» закрывает окно тем же useModalClose(), что и в примере №1.

import { Input } from "@/components/ui/Input";
import { useModalClose } from "..";

export function Content2() {
  const close = useModalClose();
  return (
    <form className="flex flex-col gap-14" onSubmit={(e) => e.preventDefault()}>
      <Input label="Имя" placeholder="Как к вам обращаться" />
      <Input
        label="Почта"
        type="email"
        placeholder="you@example.com"
        hint="Пришлём чек и статус заказа"
      />
      <button
        type="button"
        onClick={close}
        className="self-start h-40 px-16 br-full bg-primary text-primary-foreground font-13 font-w-600 transition hover:opacity-85 active:scale-97"
      >
        Сохранить
      </button>
    </form>
  );
}

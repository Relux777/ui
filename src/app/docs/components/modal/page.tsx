// Окно: установка с двумя файлами, примеры позиций, телефон и свойства.
// Конструктор — на отдельной вкладке /docs/components/modal/constructor.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FileCode } from "@boxicons/react/FileCode";
import Link from "next/link";
import { Content1 } from "@/components/ui/Modal/content/content_1";
import { Content2 } from "@/components/ui/Modal/content/content_2";
import { Part } from "../../../_docs/class-page";
import {
  Callout,
  Code,
  CodeBlock,
  Example,
  Steps,
  Table,
} from "../../../_docs/docs";
import { DownloadFile } from "../../../_docs/download-file";
import type { TocItem } from "../../../_docs/toc";
import { ComponentPage } from "../_page";
import { ModalDemo } from "./_demo";
import { ModalTabs } from "./_tabs";

export const metadata = { title: "Окно" };

const TOC: TocItem[] = [
  { id: "install", title: "Установка" },
  { id: "source", title: "Код компонента" },
  { id: "center", title: "По центру" },
  { id: "sides", title: "Справа и слева" },
  { id: "bottom", title: "Снизу" },
  { id: "phone", title: "Телефон" },
  { id: "props", title: "Свойства" },
];

const MODAL_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Modal/index.tsx"),
  "utf8",
);

const CONTENT_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Modal/content/content_1.tsx"),
  "utf8",
);

const PAGE_SRC = `import { useRef } from "react";
import { Modal, type ModalHandle } from "@/components/ui/Modal";
import { Content1 } from "@/components/ui/Modal/content/content_1";

export default function Page() {
  const ref = useRef<ModalHandle>(null);
  return (
    <>
      <button onClick={() => ref.current?.open()}>Открыть окно</button>
      <Modal ref={ref} title="Удалить файл?" position="center">
        <Content1 />
      </Modal>
    </>
  );
}`;

// код примера: отличается только position (и phone для телефона)
const usage = (
  position: string,
  phone?: string,
) => `import { useRef } from "react";
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
        position="${position}"${phone ? `\n        phone="${phone}"` : ""}
      >
        <Content1 />
      </Modal>
    </>
  );
}`;

export default function ModalPage() {
  return (
    <ComponentPage
      title="Окно"
      toc={TOC}
      tabs={<ModalTabs active="modal" />}
      lead={
        <>
          Модальное окно на <Code>&lt;dialog&gt;</Code>: по центру, справа,
          слева или снизу, а на телефоне — своя позиция. Страница под окном
          затемнена и размыта, Esc и клик мимо закрывают, внизу окно
          смахивается.
        </>
      }
    >
      <Part
        id="install"
        title="Установка"
        lead={
          <>
            Два файла: <Code>index.tsx</Code> — само окно,{" "}
            <Code>content_1.tsx</Code> — содержимое. Открытие и закрытие — через{" "}
            <Code>ref</Code>; стили RenDit SCSS уже есть (класс{" "}
            <Code>modal</Code> в <Code>_sheet.scss</Code>).
          </>
        }
      >
        <Steps
          steps={[
            {
              title: "Скачайте файлы",
              text: (
                <>
                  <Code>index.tsx</Code> — окно с позициями, затемнением,
                  смахиванием и доступностью. <Code>content_1.tsx</Code> —
                  пример содержимого; своих контентов может быть сколько угодно:{" "}
                  <Code>content_2.tsx</Code>, <Code>content_3.tsx</Code>…
                </>
              ),
              block: (
                <div className="flex flex-col gap-12 p-14 br-xl border bg-surface shadow-1">
                  {[
                    ["index.tsx", "окно целиком, без зависимостей", MODAL_SRC],
                    [
                      "content_1.tsx",
                      "пример содержимого: текст и кнопки",
                      CONTENT_SRC,
                    ],
                  ].map(([file, note, code]) => (
                    <div key={file} className="flex items-start gap-10">
                      <span className="size-36 shrink-0 grid place-items-center br-lg bg-secondary/10 text-secondary">
                        <FileCode size="sm" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-col gap-2">
                        <span className="font-14 font-w-700">{file}</span>
                        <span className="font-12 text-foreground-muted">
                          {note}
                        </span>
                      </span>
                      <DownloadFile
                        code={code}
                        filename={file}
                        variant="solid"
                        className="ml-auto self-center"
                      >
                        Скачать {file}
                      </DownloadFile>
                    </div>
                  ))}
                  <p className="font-13 text-foreground-muted">
                    <Code>src/components/ui/Modal/</Code> — окно и папка{" "}
                    <Code>content/</Code> с содержимым.
                  </p>
                </div>
              ),
            },
            {
              title: "Подключите на странице",
              text: (
                <>
                  Кнопка открывает окно через <Code>ref</Code>, кнопки контента
                  закрывают его хуком <Code>useModalClose()</Code> — пропсы
                  контенту не нужны. Позиция — пропсом <Code>position</Code>, на
                  телефоне — <Code>phone</Code>.
                </>
              ),
              block: <CodeBlock file="app/page.tsx" code={PAGE_SRC} />,
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Окно в верхнем слое, фокус внутри, <kbd>Esc</kbd> и клик по
                  затемнению закрывают. Снизу на телефоне — смахивание вниз за
                  шапку.
                </>
              ),
              result: (
                <ModalDemo
                  title="Удалить файл?"
                  button="Открыть окно"
                  position="center"
                >
                  <Content1 />
                </ModalDemo>
              ),
            },
          ]}
          done={{
            title: "Готово",
            text: (
              <>
                Дальше — собрать своё окно в{" "}
                <Link
                  href="/docs/components/modal/constructor"
                  className="font-w-600 text-secondary hover:underline"
                >
                  конструкторе
                </Link>{" "}
                или посмотреть{" "}
                <Link
                  href="/docs/components/tabs"
                  className="font-w-600 text-secondary hover:underline"
                >
                  вкладки
                </Link>
                .
              </>
            ),
          }}
        />
      </Part>

      <Part
        id="source"
        title="Код компонента"
        lead="Один файл — окно и поведение: позиции, затемнение, смахивание, доступность. Вид конкретного окна — в вашем page.tsx и контентах."
      >
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center">
          <p className="flex-1 font-13 text-foreground-muted">
            <Code>index.tsx</Code> — <Code>dialog.showModal()</Code> и всё, что
            вокруг; содержимое — файлы <Code>content/</Code>.
          </p>
          <DownloadFile
            code={MODAL_SRC}
            filename="index.tsx"
            variant="solid"
            className="max-sm:w-full"
          >
            Скачать index.tsx
          </DownloadFile>
        </div>
        <CodeBlock file="src/components/ui/Modal/index.tsx" code={MODAL_SRC} />
      </Part>

      <Part
        id="center"
        title="По центру"
        lead={
          <>
            По умолчанию: карточка по центру экрана, появляется снизу с
            пружинкой. Ширина — <Code>min(480px, 100vw − 32px)</Code> в{" "}
            <Code>_sheet.scss</Code>, своя — классом на окне.
          </>
        }
      >
        <Example title="position=&quot;center&quot;" code={usage("center")}>
          <ModalDemo
            title="Удалить файл?"
            subtitle="Файлы — 1"
            button="Открыть по центру"
          >
            <Content1 />
          </ModalDemo>
        </Example>
      </Part>

      <Part
        id="sides"
        title="Справа и слева"
        lead={
          <>
            Панель сбоку во всю высоту с полями 8px — как лист{" "}
            <Code>.sheet</Code> на планшете. Содержимое прокручивается внутри,
            страница под панелью размыта.
          </>
        }
      >
        <Example title="position=&quot;right&quot;" code={usage("right")}>
          <ModalDemo
            title="Быстрая настройка"
            subtitle="Применится сразу"
            button="Открыть справа"
            position="right"
          >
            <Content2 />
          </ModalDemo>
        </Example>
        <Example title="position=&quot;left&quot;" code={usage("left")}>
          <ModalDemo
            title="История"
            subtitle="Последние действия"
            button="Открыть слева"
            position="left"
          >
            <Content1 />
          </ModalDemo>
        </Example>
      </Part>

      <Part
        id="bottom"
        title="Снизу"
        lead={
          <>
            Лист снизу и на компьютере: <Code>position=&quot;bottom&quot;</Code>
            . Высота по содержимому, максимум 85% экрана, нижний край учитывает{" "}
            <Code>safe-area</Code>.
          </>
        }
      >
        <Example title="position=&quot;bottom&quot;" code={usage("bottom")}>
          <ModalDemo
            title="Поделиться"
            subtitle="Отчёт за июнь"
            button="Открыть снизу"
            position="bottom"
          >
            <Content1 />
          </ModalDemo>
        </Example>
      </Part>

      <Part
        id="phone"
        title="Телефон"
        lead={
          <>
            На телефоне позиция своя — пропсом <Code>phone</Code>. По умолчанию{" "}
            <Code>bottom</Code>: лист выезжает снизу и смахивается вниз за
            шапку, как в iOS и Android; размытие тает вслед за пальцем.
          </>
        }
      >
        <Example
          title="phone=&quot;right&quot;"
          code={usage("center", "right")}
        >
          <ModalDemo
            title="Удалить файл?"
            button="На телефоне — справа"
            position="center"
            phone="right"
          >
            <Content1 />
          </ModalDemo>
        </Example>
        <Example
          title="phone=&quot;bottom&quot; (по умолчанию)"
          code={usage("center")}
        >
          <ModalDemo
            title="Удалить файл?"
            button="На телефоне — снизу"
            position="center"
            phone="bottom"
          >
            <Content1 />
          </ModalDemo>
        </Example>
        <Callout tone="tip">
          Смахивание работает только на экранах уже 620px и только когда окно
          внизу. <Code>phone=&quot;center&quot;</Code> оставляет карточку по
          центру и на телефоне; поля и кнопки контента — от 44px и шрифт 16px,
          как у <Code>Input</Code>.
        </Callout>
      </Part>

      <Part
        id="props"
        title="Свойства"
        lead={
          <>
            Поведение — пропсами, вид — классами RenDit Code в{" "}
            <Code>page.tsx</Code> и в контентах. Окно открывается и закрывается
            только через <Code>ref</Code>.
          </>
        }
      >
        <Table
          head={["Свойство", "Тип", "Что делает"]}
          rows={[
            ["ref", "Ref<ModalHandle>", "open() и close() — открыть и закрыть"],
            ["title", "string", "заголовок окна, подписывает <dialog>"],
            ["subtitle", "ReactNode", "строка под заголовком"],
            [
              "position",
              '"center" | "right" | "left" | "bottom"',
              "позиция на компьютере и планшете (по умолчанию center)",
            ],
            [
              "phone",
              '"center" | "right" | "left" | "bottom"',
              "позиция на телефоне (по умолчанию bottom, смахивается)",
            ],
            [
              "className",
              "string",
              "классы окна: ширина, радиус, фон (bg-primary)",
            ],
            [
              "inline",
              "boolean",
              "окно внутри родительской рамки — для превью в документации",
            ],
            ["id", "string", "id окна — по нему его находят тесты"],
            ["children", "ReactNode", "содержимое: content_1, content_2, …"],
          ]}
        />
      </Part>
    </ComponentPage>
  );
}

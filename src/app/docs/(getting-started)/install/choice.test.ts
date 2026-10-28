// npm test — выбор на странице установки: адрес ↔ выбор, вопросы платформ

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  type Choice,
  choiceKey,
  choiceParams,
  DEFAULT_CHOICE,
  parseChoice,
  QUESTIONS,
  questionsFor,
} from "./choice.ts";

const fromQuery = (query: string, base?: Choice) => {
  const params = new URLSearchParams(query);
  return parseChoice((p) => params.get(p), base);
};

test("адрес → выбор и обратно", () => {
  const choice = fromQuery("stack=react&lang=js&styles=css&engine=none");
  assert.deepEqual(choice, {
    ...DEFAULT_CHOICE,
    platform: "react",
    lang: "js",
    styles: "css",
    engine: "none",
  });
  assert.equal(
    choiceParams(choice).toString(),
    "stack=react&lang=js&styles=css&engine=none",
  );
});

test("в адрес попадают только вопросы платформы", () => {
  const html = {
    ...DEFAULT_CHOICE,
    platform: "html",
    script: "jquery",
  } as const;
  assert.equal(choiceParams(html).toString(), "stack=html&js=jquery");
  assert.equal(choiceKey(html), "html:jquery");
});

test("вопрос про редактор — только с движком", () => {
  assert.equal(
    choiceParams(DEFAULT_CHOICE).toString(),
    "stack=nextjs&lang=ts&styles=scss&engine=code&editor=vscode",
  );
  assert.equal(choiceKey(DEFAULT_CHOICE), "nextjs:ts:scss:code:vscode");
  const plain = { ...DEFAULT_CHOICE, engine: "none" } as const;
  assert.deepEqual(questionsFor(plain), ["lang", "styles", "engine"]);
  assert.equal(choiceKey(plain), "nextjs:ts:scss:none");
  assert.equal(
    fromQuery("stack=node&engine=code&editor=other").editor,
    "other",
  );
});

test("битые и чужие значения не проходят", () => {
  assert.deepEqual(
    fromQuery("stack=vue&lang=rust&engine=1&editor=vim"),
    DEFAULT_CHOICE,
  );
  assert.deepEqual(fromQuery(""), DEFAULT_CHOICE);
});

test("пустой адрес оставляет запомненный выбор", () => {
  const saved = { ...DEFAULT_CHOICE, platform: "node", styles: "css" } as const;
  assert.deepEqual(fromQuery("", saved), saved);
});

test("у HTML нет ни Sass, ни движка", () => {
  assert.deepEqual(QUESTIONS.html, ["script"]);
  for (const p of ["nextjs", "react", "node"] as const)
    assert.ok(QUESTIONS[p].includes("engine"), p);
});

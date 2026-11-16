// Классы конструктора полей формы — без "use client": страница просит их CSS у движка при сборке.

export const ACCENT = [
  "accent-accent",
  "accent-secondary",
  "accent-primary",
  "accent-danger",
  "accent-success",
];
export const CARET = ["caret-secondary", "caret-accent", "caret-danger"];
export const RESIZE = ["resize-y", "resize-none"];

export const FORMS_CLASSES = [
  ...ACCENT,
  ...CARET,
  ...RESIZE,
  "field-sizing-content",
];

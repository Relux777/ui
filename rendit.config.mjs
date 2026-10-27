// Настройки RenDit Code. Все поля необязательны — значения по умолчанию в rendit-code/core/config.mjs.
// Изменения подхватываются на лету в `npm run dev`.
//
// Цвета, тени, скругления и градиенты здесь НЕ задаются — они живут в SCSS-токенах
// (src/assets/scss/settings/), движок находит их сам.

/** @type {import("./rendit-code/types").RenDitConfig} */
export default {
  // mobile-first: md:flex = (width >= 770px), max-md:hidden = (width < 770px)
  screens: {
    sm: "620px",
    md: "770px",
    lg: "990px",
    xl: "1200px",
    "2xl": "1400px",
  },

  // классы, которых нет в исходниках буквально (собираются из строк в рантайме)
  safelist: [],
};

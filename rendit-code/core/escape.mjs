// Экранирование имени класса для CSS-селектора — алгоритм CSS.escape() из спецификации CSSOM.
// Нужен для классов вроде md:hover:bg-primary/50, w-[calc(100%-10px)], !p-10, 2xl:flex.

export function escapeClass(value) {
  let out = "";
  const first = value.charCodeAt(0);

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const ch = value[i];

    if (code === 0) {
      out += "�";
      continue;
    }

    // управляющие символы, цифра в начале, цифра после «-» в начале → шестнадцатеричная форма «\31 »
    if (
      (code >= 0x1 && code <= 0x1f) ||
      code === 0x7f ||
      (i === 0 && code >= 0x30 && code <= 0x39) ||
      (i === 1 && code >= 0x30 && code <= 0x39 && first === 0x2d)
    ) {
      out += `\\${code.toString(16)} `;
      continue;
    }

    // одиночный «-» — не идентификатор
    if (i === 0 && value.length === 1 && code === 0x2d) {
      out += `\\${ch}`;
      continue;
    }

    if (
      code >= 0x80 ||
      code === 0x2d || // -
      code === 0x5f || // _
      (code >= 0x30 && code <= 0x39) ||
      (code >= 0x41 && code <= 0x5a) ||
      (code >= 0x61 && code <= 0x7a)
    ) {
      out += ch;
      continue;
    }

    out += `\\${ch}`;
  }

  return out;
}

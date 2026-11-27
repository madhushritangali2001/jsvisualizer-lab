type ScannerState =
  "code" | "single" | "double" | "template" | "lineComment" | "blockComment" | "regex";

const REGEX_PREFIX = /[=(,:[!&|?{;+\-*/%<>^~]/;

function isIdentifierStart(value: string): boolean {
  return /[A-Za-z_$]/.test(value);
}

function isIdentifierPart(value: string): boolean {
  return /[A-Za-z0-9_$]/.test(value);
}

/**
 * Finds the last `let`/`const`/`var` declaration at the top level of student
 * code. A small scanner is used instead of a regex so declarations written
 * inside strings, comments, loops, blocks or regexes are not mistaken for the
 * program's final value.
 */
export function lastTopLevelDeclaration(code: string): string | null {
  let state: ScannerState = "code";
  let braces = 0;
  let parens = 0;
  let brackets = 0;
  let previousSignificant = "";
  let found: string | null = null;
  let i = 0;

  while (i < code.length) {
    const char = code.charAt(i);
    const next = code.charAt(i + 1);

    if (state === "lineComment") {
      if (char === "\n") state = "code";
      i++;
      continue;
    }
    if (state === "blockComment") {
      if (char === "*" && next === "/") {
        state = "code";
        i += 2;
      } else {
        i++;
      }
      continue;
    }
    if (state === "single" || state === "double" || state === "template") {
      if (char === "\\") {
        i += 2;
        continue;
      }
      const quote = state === "single" ? "'" : state === "double" ? '"' : "`";
      if (char === quote) state = "code";
      i++;
      continue;
    }
    if (state === "regex") {
      if (char === "\\") {
        i += 2;
        continue;
      }
      if (char === "/") state = "code";
      i++;
      continue;
    }

    if (char === "/" && next === "/") {
      state = "lineComment";
      i += 2;
      continue;
    }
    if (char === "/" && next === "*") {
      state = "blockComment";
      i += 2;
      continue;
    }
    if (char === "/" && (previousSignificant === "" || REGEX_PREFIX.test(previousSignificant))) {
      state = "regex";
      i++;
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      state = char === "'" ? "single" : char === '"' ? "double" : "template";
      i++;
      continue;
    }

    if (char === "{") braces++;
    else if (char === "}") braces = Math.max(0, braces - 1);
    else if (char === "(") parens++;
    else if (char === ")") parens = Math.max(0, parens - 1);
    else if (char === "[") brackets++;
    else if (char === "]") brackets = Math.max(0, brackets - 1);

    if (isIdentifierStart(char)) {
      let end = i + 1;
      while (end < code.length && isIdentifierPart(code.charAt(end))) end++;
      const word = code.slice(i, end);

      if (
        (word === "let" || word === "const" || word === "var") &&
        braces === 0 &&
        parens === 0 &&
        brackets === 0
      ) {
        let cursor = end;
        while (cursor < code.length && /\s/.test(code.charAt(cursor))) cursor++;
        if (code.charAt(cursor) === "/" && code.charAt(cursor + 1) === "/") {
          while (cursor < code.length && code.charAt(cursor) !== "\n") cursor++;
          while (cursor < code.length && /\s/.test(code.charAt(cursor))) cursor++;
        }
        if (code.charAt(cursor) === "/" && code.charAt(cursor + 1) === "*") {
          cursor += 2;
          while (
            cursor < code.length &&
            !(code.charAt(cursor) === "*" && code.charAt(cursor + 1) === "/")
          ) {
            cursor++;
          }
          cursor += 2;
          while (cursor < code.length && /\s/.test(code.charAt(cursor))) cursor++;
        }
        if (cursor < code.length && isIdentifierStart(code.charAt(cursor))) {
          let nameEnd = cursor + 1;
          while (nameEnd < code.length && isIdentifierPart(code.charAt(nameEnd))) nameEnd++;
          found = code.slice(cursor, nameEnd);
        }
      }

      i = end;
      previousSignificant = word;
      continue;
    }

    if (!/\s/.test(char)) previousSignificant = char;
    i++;
  }

  return found;
}

/**
 * Appended to student code inside the worker. The leading newline keeps the
 * return statement out of a trailing `//` comment.
 */
export function captureSuffix(code: string): string {
  const name = lastTopLevelDeclaration(code);
  const expression = name ? `typeof ${name} === "undefined" ? undefined : ${name}` : "undefined";
  return `\n;return ${expression};`;
}

import { describe, expect, it } from "vitest";

import { captureSuffix, lastTopLevelDeclaration } from "./code-capture";

const runWithCapture = (code: string): unknown =>
  new Function("console", `"use strict";${code}${captureSuffix(code)}`)({ log: () => {} });

describe("final declared value capture", () => {
  it("captures the value even when code ends with a line comment", () => {
    expect(runWithCapture("let x = 5; // done")).toBe(5);
  });

  it("ignores declaration syntax inside string literals", () => {
    expect(runWithCapture('const s = "let hidden = 9"; console.log(s);')).toBe("let hidden = 9");
  });

  it("ignores declaration syntax inside comments", () => {
    expect(runWithCapture("let x = 7; /* let hidden = 1 */ // var fake = 2")).toBe(7);
  });

  it("ignores declarations inside a for loop header", () => {
    expect(runWithCapture("let sum = 0; for (let i = 1; i <= 3; i++) { sum += i; }")).toBe(6);
  });

  it("ignores declarations nested in functions and blocks", () => {
    expect(runWithCapture("function f() { let inner = 42; return inner; } let result = f();")).toBe(
      42,
    );
  });

  it("ignores declaration syntax inside a regular expression literal", () => {
    expect(runWithCapture("let re = /let fake = 1/;")).toBeInstanceOf(RegExp);
  });

  it("has no declaration to capture when the code only logs", () => {
    expect(lastTopLevelDeclaration("console.log(1 + 1);")).toBeNull();
    expect(runWithCapture("console.log(1 + 1);")).toBeUndefined();
  });
});

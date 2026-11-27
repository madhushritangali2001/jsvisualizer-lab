import { describe, expect, it } from "vitest";
import { findLastDeclaredName } from "./playground";

describe("findLastDeclaredName", () => {
  it("finds the last declared variable in plain code", () => {
    expect(findLastDeclaredName("let age = 20;\nage = 21;\nconsole.log(age);")).toBe("age");
    expect(findLastDeclaredName("let person = {};\nlet copy = person;")).toBe("copy");
  });

  it("ignores declarations mentioned inside string literals", () => {
    expect(findLastDeclaredName('let x = 10;\nconsole.log("let hidden = 5");')).toBe("x");
  });

  it("ignores declarations mentioned inside comments", () => {
    expect(findLastDeclaredName("// let hidden = 5\nlet x = 10;")).toBe("x");
    expect(findLastDeclaredName("let x = 10;\n/* const hidden = 5; */")).toBe("x");
  });

  it("ignores declarations mentioned inside template literals", () => {
    expect(findLastDeclaredName("let x = 10;\nconsole.log(`var hidden = ${x}`);")).toBe("x");
  });

  it("returns undefined when nothing is declared", () => {
    expect(findLastDeclaredName('console.log("hello");')).toBeUndefined();
  });
});

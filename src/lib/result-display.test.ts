import { describe, expect, it } from "vitest";

import { logsText, outputText } from "./result-display";

const base = {
  value: "42",
  type: "number",
  detected: "Number",
  isArray: false,
};

describe("sandbox result display", () => {
  it("falls back to the value when no output was logged", () => {
    expect(outputText({ ...base, logs: [] })).toBe("42");
    expect(outputText(base)).toBe("42");
  });

  it("shows logged output when it exists", () => {
    expect(outputText({ ...base, logs: ["first", "second"] })).toBe("first\nsecond");
  });

  it("ignores a malformed logs field instead of throwing", () => {
    expect(logsText({ logs: {} })).toBe("");
    expect(outputText({ ...base, logs: {} })).toBe("42");
  });

  it("renders an empty output area when there are no logs", () => {
    expect(logsText({ logs: [] })).toBe("");
    expect(logsText({ logs: ["hello"] })).toBe("hello");
  });
});

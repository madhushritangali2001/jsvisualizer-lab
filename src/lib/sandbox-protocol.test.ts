import { describe, expect, it } from "vitest";

import { createNonce, parseSandboxMessage } from "./sandbox-protocol";

const NONCE = "run-123";

describe("sandbox result messages", () => {
  it("accepts a well-formed result with the matching run nonce", () => {
    const parsed = parseSandboxMessage(
      {
        nonce: NONCE,
        value: "42",
        type: "number",
        detected: "Number",
        isArray: false,
        logs: ["42"],
      },
      NONCE,
    );

    expect(parsed).toEqual({
      kind: "result",
      execution: {
        value: "42",
        type: "number",
        detected: "Number",
        isArray: false,
        logs: ["42"],
      },
    });
  });

  it("rejects a message from a different run", () => {
    expect(
      parseSandboxMessage({ nonce: "other-run", value: "x", type: "string" }, NONCE),
    ).toBeNull();
  });

  it("rejects a non-array logs field instead of passing it to React", () => {
    expect(
      parseSandboxMessage({ nonce: NONCE, type: "string", value: "x", logs: {} }, NONCE),
    ).toBeNull();
  });

  it("rejects logs containing non-string entries", () => {
    expect(
      parseSandboxMessage({ nonce: NONCE, type: "string", value: "x", logs: ["ok", {}] }, NONCE),
    ).toBeNull();
  });

  it("rejects spoofed object fields that would crash rendering", () => {
    expect(
      parseSandboxMessage({ nonce: NONCE, type: "string", value: "x", detected: {} }, NONCE),
    ).toBeNull();
    expect(
      parseSandboxMessage({ nonce: NONCE, type: "error", value: "", error: {} }, NONCE),
    ).toBeNull();
  });

  it("reads progress logs so output is retained before a timeout", () => {
    expect(
      parseSandboxMessage({ nonce: NONCE, kind: "progress", logs: ["first", "second"] }, NONCE),
    ).toEqual({ kind: "progress", logs: ["first", "second"] });
  });

  it("caps oversized output values and log counts", () => {
    const parsed = parseSandboxMessage(
      {
        nonce: NONCE,
        value: "x".repeat(6000),
        type: "string",
        logs: Array.from({ length: 150 }, (_, i) => `log-${i}`),
      },
      NONCE,
    );

    expect(parsed).not.toBeNull();
    if (parsed?.kind !== "result") throw new Error("expected a result message");
    expect(parsed.execution.value).toHaveLength(5000);
    expect(parsed.execution.logs).toHaveLength(100);
  });

  it("creates a different nonce for each run", () => {
    expect(createNonce()).not.toBe(createNonce());
  });
});

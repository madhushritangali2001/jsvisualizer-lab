import { describe, expect, it } from "vitest";

import { buildWorkerSource } from "./sandbox-worker";

type FakeWorker = {
  postMessage: (message: unknown) => void;
  onmessage: ((event: { data: string }) => void) | null;
};

function runWorker(
  code: string,
  capture = "\n;return undefined;",
  useCapturedValue = false,
): unknown[] {
  const messages: unknown[] = [];
  const self: FakeWorker = {
    postMessage: (message) => messages.push(message),
    onmessage: null,
  };
  const source = buildWorkerSource({
    code,
    capture,
    useCapturedValue,
    nonce: "run-1",
  });
  new Function("self", source)(self);
  self.onmessage?.({ data: "run-1" });
  return messages;
}

describe("sandbox worker protocol", () => {
  it("sends each logged line as a progress message before the result", () => {
    const messages = runWorker('console.log("before"); let x = 1;', "\n;return x;", true);

    expect(messages[0]).toEqual({
      kind: "progress",
      logs: ["before"],
      nonce: "run-1",
    });
    expect(messages.at(-1)).toMatchObject({
      kind: "result",
      value: "1",
      logs: ["before"],
      nonce: "run-1",
    });
  });

  it("keeps logs when execution throws", () => {
    const messages = runWorker('console.log("first"); throw new Error("boom");');

    expect(messages[0]).toEqual({
      kind: "progress",
      logs: ["first"],
      nonce: "run-1",
    });
    expect(messages.at(-1)).toMatchObject({
      kind: "result",
      type: "error",
      logs: ["first"],
      nonce: "run-1",
    });
  });
});

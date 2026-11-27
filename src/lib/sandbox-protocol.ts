export type Execution = {
  value: string;
  type: string;
  detected: string;
  isArray: boolean;
  logs?: string[];
  error?: string;
};

export type ParsedSandboxMessage =
  { kind: "result"; execution: Execution } | { kind: "progress"; logs: string[] };

const MAX_TEXT_LENGTH = 5000;
const MAX_LOG_COUNT = 100;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function truncate(value: string): string {
  return value.slice(0, MAX_TEXT_LENGTH);
}

function normalizeLogs(logs: string[]): string[] {
  return logs.map(truncate).slice(0, MAX_LOG_COUNT);
}

export function createNonce(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Worker messages are untrusted: student code can call self.postMessage itself.
 * Only messages carrying this run's nonce and a fully typed payload are accepted.
 */
export function parseSandboxMessage(data: unknown, nonce: string): ParsedSandboxMessage | null {
  if (!isRecord(data) || data["nonce"] !== nonce) return null;

  const logs = data["logs"];
  if (
    logs !== undefined &&
    (!Array.isArray(logs) || !logs.every((entry) => typeof entry === "string"))
  ) {
    return null;
  }

  if (data["kind"] === "progress") {
    return { kind: "progress", logs: logs ? normalizeLogs(logs as string[]) : [] };
  }

  if (typeof data["value"] !== "string" || typeof data["type"] !== "string") return null;
  if (data["detected"] !== undefined && typeof data["detected"] !== "string") return null;
  if (data["error"] !== undefined && typeof data["error"] !== "string") return null;
  if (data["isArray"] !== undefined && typeof data["isArray"] !== "boolean") return null;

  const execution: Execution = {
    value: truncate(data["value"] as string),
    type: truncate(data["type"] as string),
    detected: data["detected"] === undefined ? "" : truncate(data["detected"] as string),
    isArray: data["isArray"] === true,
  };
  if (logs !== undefined) execution.logs = normalizeLogs(logs as string[]);
  if (data["error"] !== undefined) execution.error = truncate(data["error"] as string);

  return { kind: "result", execution };
}

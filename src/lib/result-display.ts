export function logsText(result: { logs?: unknown }): string {
  return Array.isArray(result.logs) ? result.logs.join("\n") : "";
}

export function outputText(result: { value: string; logs?: unknown }): string {
  return logsText(result) || result.value;
}

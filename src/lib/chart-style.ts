const SAFE_ID = /[^a-zA-Z0-9_-]/g;
const SAFE_COLOR = /^[#a-zA-Z0-9(),.\s%+-]+$/;

export function sanitizeChartId(id: string): string {
  return id.replace(SAFE_ID, "");
}

export function sanitizeChartColor(color: unknown): string {
  return typeof color === "string" && SAFE_COLOR.test(color) ? color : "";
}

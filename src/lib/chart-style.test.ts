import { describe, expect, it } from "vitest";

import { sanitizeChartColor, sanitizeChartId } from "./chart-style";

describe("chart style interpolation", () => {
  it("strips selector-breaking characters from chart ids", () => {
    expect(sanitizeChartId('chart"]{}body{display:none')).toBe("chartbodydisplaynone");
  });

  it("keeps ordinary chart identifiers intact", () => {
    expect(sanitizeChartId("revenue_2026-chart")).toBe("revenue_2026-chart");
  });

  it("drops colors containing CSS or HTML injection", () => {
    expect(sanitizeChartColor("red;} body{display:none")).toBe("");
    expect(sanitizeChartColor('"</style><script>alert(1)</script>')).toBe("");
  });

  it("keeps valid CSS colors intact", () => {
    expect(sanitizeChartColor("#fff")).toBe("#fff");
    expect(sanitizeChartColor("rgb(12, 34, 56)")).toBe("rgb(12, 34, 56)");
  });
});

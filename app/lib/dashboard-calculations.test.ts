import { describe, expect, it } from "vitest";
import { calculatePercentageChange } from "./dashboard-calculations";

describe("calculatePercentageChange", () => {
  it("calculates a percentage increase", () => {
    expect(calculatePercentageChange(120, 100)).toBe(20);
  });

  it("calculates a percentage decrease", () => {
    expect(calculatePercentageChange(80, 100)).toBe(-20);
  });

  it("returns zero when the previous value is zero", () => {
    expect(calculatePercentageChange(100, 0)).toBe(0);
  });

  it("returns zero when the values are equal", () => {
    expect(calculatePercentageChange(100, 100)).toBe(0);
  });
});

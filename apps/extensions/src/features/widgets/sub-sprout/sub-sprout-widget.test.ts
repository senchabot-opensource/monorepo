import { describe, expect, it } from "vitest";
import { formatPotLabel } from "./sub-sprout-widget";

describe("formatPotLabel", () => {
  it("formats stage over total", () => {
    expect(formatPotLabel(1, 10)).toBe("1/10");
    expect(formatPotLabel(0, 10)).toBe("0/10");
    expect(formatPotLabel(9, 9)).toBe("9/9");
  });

  it("clamps out-of-range stages", () => {
    expect(formatPotLabel(12, 10)).toBe("10/10");
    expect(formatPotLabel(-3, 10)).toBe("0/10");
  });

  it("floors fractional values and guards bad totals", () => {
    expect(formatPotLabel(2.7, 7)).toBe("2/7");
    expect(formatPotLabel(3, 0)).toBe("1/1");
  });
});

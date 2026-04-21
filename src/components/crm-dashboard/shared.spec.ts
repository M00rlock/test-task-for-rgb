import { formatCurrency, formatDate, statusMeta, statusCountLabel } from "./shared";

describe("formatCurrency", () => {
  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats whole number", () => {
    expect(formatCurrency(2500)).toBe("$2,500");
  });

  it("rounds decimals", () => {
    expect(formatCurrency(1999.99)).toBe("$2,000");
  });
});

describe("formatDate", () => {
  it("returns a non-empty string for a valid ISO date", () => {
    const result = formatDate("2024-03-15T00:00:00.000Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes the year", () => {
    expect(formatDate("2024-03-15T00:00:00.000Z")).toContain("2024");
  });
});

describe("statusMeta", () => {
  it("returns correct label for NEW", () => {
    expect(statusMeta("NEW").label).toBe("New");
  });

  it("returns correct label for IN_PROGRESS", () => {
    expect(statusMeta("IN_PROGRESS").label).toBe("In progress");
  });

  it("returns correct label for WON", () => {
    expect(statusMeta("WON").label).toBe("Won");
  });

  it("returns correct label for LOST", () => {
    expect(statusMeta("LOST").label).toBe("Lost");
  });

  it("returns badge class for each status", () => {
    for (const status of ["NEW", "IN_PROGRESS", "WON", "LOST"] as const) {
      expect(statusMeta(status).badge.length).toBeGreaterThan(0);
    }
  });

  it("throws for unsupported status", () => {
    expect(() => statusMeta("UNKNOWN" as never)).toThrow("Unsupported status: UNKNOWN");
  });
});

describe("statusCountLabel", () => {
  it("returns singular for 1 deal", () => {
    expect(statusCountLabel(1)).toBe("1 deal");
  });

  it("returns plural for 0 deals", () => {
    expect(statusCountLabel(0)).toBe("0 deals");
  });

  it("returns plural for multiple deals", () => {
    expect(statusCountLabel(5)).toBe("5 deals");
  });
});

import { buildPaginationMeta } from "./pagination";

describe("buildPaginationMeta", () => {
  it("returns correct meta for a middle page", () => {
    expect(buildPaginationMeta(2, 10, 35)).toEqual({
      page: 2,
      limit: 10,
      total: 35,
      totalPages: 4
    });
  });

  it("returns totalPages of 1 when total is 0", () => {
    expect(buildPaginationMeta(1, 10, 0)).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    });
  });

  it("returns totalPages of 1 when total equals limit", () => {
    expect(buildPaginationMeta(1, 10, 10)).toEqual({
      page: 1,
      limit: 10,
      total: 10,
      totalPages: 1
    });
  });

  it("rounds up totalPages when total is not divisible by limit", () => {
    expect(buildPaginationMeta(1, 6, 13)).toMatchObject({ totalPages: 3 });
  });
});

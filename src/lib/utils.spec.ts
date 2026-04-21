import { cn } from "./utils";

describe("cn", () => {
  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("resolves tailwind conflicts — last wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("resolves conflicting text colors", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("keeps non-conflicting classes", () => {
    expect(cn("flex", "items-center", "p-4")).toBe("flex items-center p-4");
  });
});

import { ConflictException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { assertFound, mapUniqueConstraintError } from "./prisma.errors";

describe("assertFound", () => {
  it("returns the value when it is defined", () => {
    const value = { id: "1", name: "Acme" };
    expect(assertFound(value, "Client", "1")).toBe(value);
  });

  it("throws NotFoundException when value is null", () => {
    expect(() => assertFound(null, "Client", "abc")).toThrow(NotFoundException);
  });

  it("throws NotFoundException when value is undefined", () => {
    expect(() => assertFound(undefined, "Deal", "xyz")).toThrow(NotFoundException);
  });

  it("includes entity name and id in the error message", () => {
    expect(() => assertFound(null, "Client", "abc-123")).toThrow("Client abc-123 not found");
  });
});

describe("mapUniqueConstraintError", () => {
  it("throws ConflictException for Prisma P2002 error", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "5.0.0"
    });

    expect(() => mapUniqueConstraintError(prismaError, "Email already exists")).toThrow(
      ConflictException
    );
  });

  it("includes the provided message in ConflictException", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "5.0.0"
    });

    expect(() => mapUniqueConstraintError(prismaError, "Email already exists")).toThrow(
      "Email already exists"
    );
  });

  it("re-throws non-P2002 Prisma errors as-is", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "5.0.0"
    });

    expect(() => mapUniqueConstraintError(prismaError, "msg")).toThrow(prismaError);
  });

  it("re-throws generic errors as-is", () => {
    const error = new Error("unexpected");
    expect(() => mapUniqueConstraintError(error, "msg")).toThrow(error);
  });
});

import { ConflictException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export function assertFound<T>(value: T | null | undefined, entityName: string, id: string): T {
  if (!value) {
    throw new NotFoundException(`${entityName} ${id} not found`);
  }

  return value;
}

export function mapUniqueConstraintError(error: unknown, message: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new ConflictException(message);
  }

  throw error;
}

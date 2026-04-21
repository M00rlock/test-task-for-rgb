import { ConflictException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { ClientsService } from "./clients.service";

const mockClient = {
  id: "client-1",
  name: "Acme Inc",
  email: "hello@acme.com",
  phone: "+380501112233",
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockPrisma = {
  client: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

describe("ClientsService", () => {
  let service: ClientsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ClientsService(mockPrisma as never);
  });

  describe("findAll", () => {
    it("returns paginated clients", async () => {
      mockPrisma.client.findMany.mockResolvedValue([mockClient]);
      mockPrisma.client.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual([mockClient]);
      expect(result.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
    });

    it("calculates correct skip for page 2", async () => {
      mockPrisma.client.findMany.mockResolvedValue([]);
      mockPrisma.client.count.mockResolvedValue(0);

      await service.findAll({ page: 2, limit: 5 });

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 5, take: 5 })
      );
    });
  });

  describe("findOne", () => {
    it("returns client when found", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(mockClient);
      const result = await service.findOne("client-1");
      expect(result).toEqual(mockClient);
    });

    it("throws NotFoundException when client does not exist", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);
      await expect(service.findOne("missing")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("creates and returns a client", async () => {
      mockPrisma.client.create.mockResolvedValue(mockClient);
      const result = await service.create({ name: "Acme Inc", email: "hello@acme.com" });
      expect(result).toEqual(mockClient);
    });

    it("throws ConflictException on duplicate email", async () => {
      mockPrisma.client.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Unique constraint", {
          code: "P2002",
          clientVersion: "5.0.0"
        })
      );

      await expect(service.create({ name: "Acme", email: "hello@acme.com" })).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("update", () => {
    it("updates and returns the client", async () => {
      const updated = { ...mockClient, name: "Acme Updated" };
      mockPrisma.client.findUnique.mockResolvedValue(mockClient);
      mockPrisma.client.update.mockResolvedValue(updated);

      const result = await service.update("client-1", { name: "Acme Updated" });
      expect(result).toEqual(updated);
    });

    it("throws NotFoundException when client does not exist", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);
      await expect(service.update("missing", { name: "X" })).rejects.toThrow(NotFoundException);
    });

    it("throws ConflictException on duplicate email", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(mockClient);
      mockPrisma.client.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Unique constraint", {
          code: "P2002",
          clientVersion: "5.0.0"
        })
      );

      await expect(service.update("client-1", { email: "taken@acme.com" })).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("remove", () => {
    it("deletes and returns the client", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(mockClient);
      mockPrisma.client.delete.mockResolvedValue(mockClient);

      const result = await service.remove("client-1");
      expect(result).toEqual(mockClient);
    });

    it("throws NotFoundException when client does not exist", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);
      await expect(service.remove("missing")).rejects.toThrow(NotFoundException);
    });
  });
});

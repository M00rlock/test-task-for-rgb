import { NotFoundException } from "@nestjs/common";

import { DealsService } from "./deals.service";

const mockClient = {
  id: "client-1",
  name: "Acme Inc",
  email: "hello@acme.com",
  phone: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockDeal = {
  id: "deal-1",
  title: "Website redesign",
  amount: 2500,
  status: "NEW" as const,
  clientId: "client-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  client: mockClient
};

const mockPrisma = {
  deal: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  client: {
    findUnique: jest.fn()
  }
};

describe("DealsService", () => {
  let service: DealsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DealsService(mockPrisma as never);
  });

  describe("findAll", () => {
    it("returns all deals when no filters provided", async () => {
      mockPrisma.deal.findMany.mockResolvedValue([mockDeal]);
      const result = await service.findAll({});
      expect(result).toEqual([mockDeal]);
      expect(mockPrisma.deal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
    });

    it("filters by status", async () => {
      mockPrisma.deal.findMany.mockResolvedValue([mockDeal]);
      await service.findAll({ status: "NEW" as never });
      expect(mockPrisma.deal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "NEW" } })
      );
    });

    it("filters by clientId", async () => {
      mockPrisma.deal.findMany.mockResolvedValue([mockDeal]);
      await service.findAll({ clientId: "client-1" });
      expect(mockPrisma.deal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { clientId: "client-1" } })
      );
    });

    it("filters by both status and clientId", async () => {
      mockPrisma.deal.findMany.mockResolvedValue([mockDeal]);
      await service.findAll({ status: "WON" as never, clientId: "client-1" });
      expect(mockPrisma.deal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "WON", clientId: "client-1" } })
      );
    });
  });

  describe("findOne", () => {
    it("returns deal when found", async () => {
      mockPrisma.deal.findUnique.mockResolvedValue(mockDeal);
      const result = await service.findOne("deal-1");
      expect(result).toEqual(mockDeal);
    });

    it("throws NotFoundException when deal does not exist", async () => {
      mockPrisma.deal.findUnique.mockResolvedValue(null);
      await expect(service.findOne("missing")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("creates and returns a deal", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(mockClient);
      mockPrisma.deal.create.mockResolvedValue(mockDeal);

      const result = await service.create({
        title: "Website redesign",
        amount: 2500,
        clientId: "client-1"
      });

      expect(result).toEqual(mockDeal);
    });

    it("throws NotFoundException when client does not exist", async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ title: "Deal", amount: 100, clientId: "missing" })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("updates and returns the deal", async () => {
      const updated = { ...mockDeal, title: "New title" };
      mockPrisma.deal.findUnique.mockResolvedValue(mockDeal);
      mockPrisma.deal.update.mockResolvedValue(updated);

      const result = await service.update("deal-1", { title: "New title" });
      expect(result).toEqual(updated);
    });

    it("validates new clientId when provided", async () => {
      mockPrisma.deal.findUnique.mockResolvedValue(mockDeal);
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(service.update("deal-1", { clientId: "missing" })).rejects.toThrow(
        NotFoundException
      );
    });

    it("throws NotFoundException when deal does not exist", async () => {
      mockPrisma.deal.findUnique.mockResolvedValue(null);
      await expect(service.update("missing", { title: "X" })).rejects.toThrow(NotFoundException);
    });

    it("connects new client when clientId is provided", async () => {
      const newClient = { ...mockClient, id: "client-2" };
      mockPrisma.deal.findUnique.mockResolvedValue(mockDeal);
      mockPrisma.client.findUnique.mockResolvedValue(newClient);
      mockPrisma.deal.update.mockResolvedValue({ ...mockDeal, clientId: "client-2" });

      await service.update("deal-1", { clientId: "client-2" });

      expect(mockPrisma.deal.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            client: { connect: { id: "client-2" } }
          })
        })
      );
    });
  });

  describe("remove", () => {
    it("deletes and returns the deal", async () => {
      mockPrisma.deal.findUnique.mockResolvedValue(mockDeal);
      mockPrisma.deal.delete.mockResolvedValue(mockDeal);

      const result = await service.remove("deal-1");
      expect(result).toEqual(mockDeal);
    });

    it("throws NotFoundException when deal does not exist", async () => {
      mockPrisma.deal.findUnique.mockResolvedValue(null);
      await expect(service.remove("missing")).rejects.toThrow(NotFoundException);
    });
  });
});

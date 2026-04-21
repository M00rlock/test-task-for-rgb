import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { assertFound } from "../common/prisma/prisma.errors";
import { DEAL_WITH_CLIENT_INCLUDE } from "../common/prisma/prisma.constants";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { ListDealsQueryDto } from "./dto/list-deals-query.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ status, clientId }: ListDealsQueryDto) {
    const where: Prisma.DealWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    return this.prisma.deal.findMany({
      where,
      include: DEAL_WITH_CLIENT_INCLUDE,
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findOne(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: DEAL_WITH_CLIENT_INCLUDE
    });

    return assertFound(deal, "Deal", id);
  }

  async create(createDealDto: CreateDealDto) {
    await this.ensureClientExists(createDealDto.clientId);

    return this.prisma.deal.create({
      data: {
        title: createDealDto.title,
        amount: createDealDto.amount,
        status: createDealDto.status,
        client: {
          connect: {
            id: createDealDto.clientId
          }
        }
      },
      include: DEAL_WITH_CLIENT_INCLUDE
    });
  }

  async update(id: string, updateDealDto: UpdateDealDto) {
    await this.findOne(id);

    if (updateDealDto.clientId) {
      await this.ensureClientExists(updateDealDto.clientId);
    }

    const { clientId, ...data } = updateDealDto;

    return this.prisma.deal.update({
      where: { id },
      data: {
        ...data,
        ...(clientId
          ? {
              client: {
                connect: {
                  id: clientId
                }
              }
            }
          : {})
      },
      include: DEAL_WITH_CLIENT_INCLUDE
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.deal.delete({
      where: { id }
    });
  }

  private async ensureClientExists(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        id: clientId
      }
    });

    return assertFound(client, "Client", clientId);
  }
}

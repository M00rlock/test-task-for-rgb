import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

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
      include: {
        client: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findOne(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        client: true
      }
    });

    if (!deal) {
      throw new NotFoundException(`Deal ${id} not found`);
    }

    return deal;
  }

  async create(createDealDto: CreateDealDto) {
    const client = await this.prisma.client.findUnique({
      where: {
        id: createDealDto.clientId
      }
    });

    if (!client) {
      throw new NotFoundException(`Client ${createDealDto.clientId} not found`);
    }

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
      include: {
        client: true
      }
    });
  }

  async update(id: string, updateDealDto: UpdateDealDto) {
    await this.findOne(id);

    if (updateDealDto.clientId) {
      const client = await this.prisma.client.findUnique({
        where: {
          id: updateDealDto.clientId
        }
      });

      if (!client) {
        throw new NotFoundException(`Client ${updateDealDto.clientId} not found`);
      }
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
      include: {
        client: true
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.deal.delete({
      where: { id }
    });
  }
}

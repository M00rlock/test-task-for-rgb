import { Injectable } from "@nestjs/common";

import { buildPaginationMeta } from "../common/pagination/pagination";
import {
  CLIENT_LIST_ORDER_BY_CREATED_AT_DESC,
  CLIENT_WITH_DEALS_INCLUDE
} from "../common/prisma/prisma.constants";
import { assertFound, mapUniqueConstraintError } from "../common/prisma/prisma.errors";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { ListClientsQueryDto } from "./dto/list-clients-query.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ page, limit }: ListClientsQueryDto) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take: limit,
        orderBy: CLIENT_LIST_ORDER_BY_CREATED_AT_DESC
      }),
      this.prisma.client.count()
    ]);

    return {
      data,
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: CLIENT_WITH_DEALS_INCLUDE
    });

    return assertFound(client, "Client", id);
  }

  async create(createClientDto: CreateClientDto) {
    try {
      return await this.prisma.client.create({
        data: createClientDto
      });
    } catch (error) {
      mapUniqueConstraintError(error, "Client with this email already exists");
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id);

    try {
      return await this.prisma.client.update({
        where: { id },
        data: updateClientDto
      });
    } catch (error) {
      mapUniqueConstraintError(error, "Client with this email already exists");
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.client.delete({
      where: { id }
    });
  }
}

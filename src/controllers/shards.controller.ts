import { FastifyInstance } from "fastify";
import { BaseController } from "./base.controller";

export class ShardsController extends BaseController<any> {
  model: any;

  constructor(server: FastifyInstance) {
    super();
    this.model = server.prisma.shard;
  }
}

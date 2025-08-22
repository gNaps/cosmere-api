import { FastifyInstance } from "fastify";
import { BaseController } from "./base.controller";

export class SeriesController extends BaseController<any> {
  model: any;

  constructor(server: FastifyInstance) {
    super();
    this.model = server.prisma.series;
  }
}

import { FastifyInstance } from "fastify";
import { SeriesController } from "../controllers/series.controller";

export default async function (server: FastifyInstance) {
  const controller = new SeriesController(server);

  server.get("/series", controller.getMany.bind(controller));
  server.get("/series/:id", controller.getOne.bind(controller));
}

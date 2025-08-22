import { FastifyInstance } from "fastify";
import { PlanetsController } from "../controllers/planets.controller";

export default async function (server: FastifyInstance) {
  const controller = new PlanetsController(server);

  server.get("/planets", controller.getMany.bind(controller));
  server.get("/planets/:id", controller.getOne.bind(controller));
}

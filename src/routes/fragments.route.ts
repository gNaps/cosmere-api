import { FastifyInstance } from "fastify";
import { FragmentsController } from "../controllers/fragments.controller";

export default async function (server: FastifyInstance) {
  const controller = new FragmentsController(server);

  server.get("/fragments", controller.getMany.bind(controller));
  server.get("/fragments/:id", controller.getOne.bind(controller));
}

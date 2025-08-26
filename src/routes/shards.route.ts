import { FastifyInstance } from "fastify";
import { ShardsController } from "../controllers/shards.controller";

export default async function (server: FastifyInstance) {
  const controller = new ShardsController(server);

  server.get("/shards", controller.getMany.bind(controller));
  server.get("/shards/:id", controller.getOne.bind(controller));
}

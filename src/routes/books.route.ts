import { FastifyInstance } from "fastify";
import { BooksController } from "../controllers/books.controller";

export default async function (server: FastifyInstance) {
  const controller = new BooksController(server);

  server.get("/books", controller.getMany.bind(controller));
  server.get("/books/:id", controller.getOne.bind(controller));
}

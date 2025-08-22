import { FastifyInstance } from "fastify";
import booksRoutes from "./books.route";
import fragmentsRoute from "./fragments.route";
import planetsRoute from "./planets.route";
import seriesRoute from "./series.route";

export default async function (server: FastifyInstance) {
  server.register(booksRoutes);
  server.register(fragmentsRoute);
  server.register(planetsRoute);
  server.register(seriesRoute);
}

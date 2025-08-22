import prisma from "./plugins/prisma";
import routes from "./routes";
import { rateLimitMiddleware } from "./utils/rateLimit";

const server = (
  app: any, // FastifyInstance,
  opts: any, // FastifyServerOptions,
  done: any
) => {
  //const server = Fastify({ logger: true });

  app.register(prisma);
  app.register(routes);

  if (process.env.NODE_ENV !== "development") {
    app.addHook("preHandler", rateLimitMiddleware);
  }

  done();
};

export default server;

// const start = async () => {
//   try {
//     await server.listen({ port: 3000, host: "0.0.0.0" });
//     console.log("🚀 Server running on http://localhost:3000");
//   } catch (err) {
//     server.log.error(err);
//     process.exit(1);
//   }
// };

// start();

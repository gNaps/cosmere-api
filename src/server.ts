import rateLimit from "@fastify/rate-limit";
import { Redis } from "@upstash/redis";
import prisma from "./plugins/prisma";
import routes from "./routes";

const server = (
  app: any, // FastifyInstance,
  opts: any, // FastifyServerOptions,
  done: any
) => {
  //const server = Fastify({ logger: true });

  app.register(prisma);
  app.register(routes);

  if (process.env.NODE_ENV !== "development") {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    app.register(rateLimit, {
      max: 1000,
      timeWindow: "1d",
      redis,
      keyGenerator: (req: any) => req.ip,
    });
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

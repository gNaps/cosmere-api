import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

export default fp(async (server) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async (s) => {
    await s.prisma.$disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

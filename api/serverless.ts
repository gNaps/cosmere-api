import * as dotenv from "dotenv";
import Fastify from "fastify";
import server from "../src/server";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = Fastify({
  logger: true,
});

app.register(server, {
  prefix: "/",
});

if (process.env.NODE_ENV === "development") {
  app.listen(
    { port: +process.env.PORT!, host: "0.0.0.0" },
    (error: any, address: any) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      console.log(`Server running on ${address}`);
    }
  );
}

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit("request", req, res);
};

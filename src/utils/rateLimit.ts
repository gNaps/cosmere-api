import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { FastifyReply, FastifyRequest } from "fastify";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1d"), // 100 richieste al giorno
});

export async function rateLimitMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const ip = req.ip; // IP del client
    const { success, limit, remaining } = await ratelimit.limit(ip);

    // Imposta header per debug / info
    reply.header("X-RateLimit-Limit", limit.toString());
    reply.header("X-RateLimit-Remaining", remaining.toString());

    if (!success) {
      return reply.status(429).send({ error: "Too many requests" });
    }
  } catch (err) {
    console.error("Rate limit error:", err);
    // In caso di errore Redis, non bloccare la richiesta
  }
}

import { FastifyReply, FastifyRequest } from "fastify";
import { parseStringFilters } from "../utils/filters";
import { parsePopulate, parseSelect } from "../utils/populates";

export abstract class BaseController<T> {
  abstract model: any;

  constructor() {}

  async getMany(req: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        skip = "0",
        take = "50",
        sort,
        fields,
        populate,
        filters,
      } = req.query as any;

      const where = filters ? parseStringFilters(filters) : undefined;
      const select = fields ? parseSelect(fields) : undefined;
      const include = populate ? parsePopulate(populate) : undefined;

      console.log("WHERE CONDITION", JSON.stringify(where));
      console.log("SELECT FIELDS", select);
      console.log("INCLUDE RELATIONS", include);

      // orderBy
      let orderBy: any = undefined;
      if (sort) {
        orderBy = {};
        (sort as string).split(",").forEach((s) => {
          const [field, dir] = s.split(":");
          orderBy[field] = dir === "desc" ? "desc" : "asc";
        });
      }

      console.log("ORDER BY", orderBy);

      // Combina select e include in una sola property include
      let combinedInclude: any = undefined;
      if (select && include) {
        combinedInclude = { ...select, ...include };
      } else if (include) {
        combinedInclude = include;
      } else if (select) {
        // Prisma non accetta include senza relazioni, quindi usiamo select come fallback
        combinedInclude = undefined;
      }

      console.log("combinedInclude", combinedInclude);

      const data = await this.model.findMany({
        ...(where && { where }),
        ...(combinedInclude && select
          ? { select: combinedInclude }
          : combinedInclude && !select
          ? { include: combinedInclude }
          : !combinedInclude && select
          ? { select }
          : {}),
        skip: +skip,
        take: +take,
        orderBy,
      });

      const total = await this.model.count({ where });

      reply.send({
        data,
        meta: {
          skip: Number(skip),
          take: Number(take),
          total,
          pages: Math.ceil(total / Number(take)),
        },
      });
    } catch (err: any) {
      reply.status(400).send({ error: err.message });
    }
  }

  async getOne(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as any;
      const { fields, populate } = req.query as any;

      const select = fields ? parseSelect(fields) : undefined;
      const include = populate ? parsePopulate(populate) : undefined;
      let combinedInclude: any = undefined;
      if (select && include) {
        combinedInclude = { ...select, ...include };
      } else if (include) {
        combinedInclude = include;
      } else if (select) {
        // Prisma non accetta include senza relazioni, quindi usiamo select come fallback
        combinedInclude = undefined;
      }

      const data = await this.model.findUnique({
        where: { id: Number(id) },
        ...(combinedInclude && select
          ? { select: combinedInclude }
          : combinedInclude && !select
          ? { include: combinedInclude }
          : !combinedInclude && select
          ? { select }
          : {}),
      });

      if (!data) return reply.status(404).send({ error: "Not found" });

      reply.send({ data });
    } catch (err: any) {
      reply.status(400).send({ error: err.message });
    }
  }
}

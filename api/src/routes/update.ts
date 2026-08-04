import type { FastifyInstance } from "fastify";
import { getVersion, checkUpdate, applyUpdate } from "../adapters/update.js";
import { requireAdmin } from "../plugins/auth.js";

export async function updateRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/version", async (_request, reply) => {
        const version = await getVersion();

        return reply.code(200).send({ version });
    });

    fastify.get("/api/v1/update", async (_request, reply) => {
        const info = await checkUpdate();

        return reply.code(200).send(info);
    });

    fastify.post("/api/v1/update", async (request, reply) => {
        const body = request.body as { noRedeploy?: boolean };

        try {
            const result = await applyUpdate(body?.noRedeploy === true);
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(500).send({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    });
}

import type { FastifyInstance } from "fastify";
import { getPower, setPower } from "../adapters/power.js";
import { requireAdmin } from "../plugins/auth.js";

export async function powerRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/power", async () => {
        return getPower();
    });

    fastify.put("/api/v1/power", async (request, reply) => {
        const body = request.body as { shutdown?: string; wake?: string; enabled?: boolean };

        const isEnabled = body.enabled !== false;

        if (isEnabled) {
            if (!body?.shutdown || !body?.wake) {
                return reply.code(400).send({ error: "shutdown e wake (HH:MM) são obrigatórios para ativar" });
            }
        }

        try {
            const result = await setPower(
                body?.shutdown || "",
                body?.wake || "",
                isEnabled,
            );
            return reply.send(result);
        } catch (error) {
            return reply.code(500).send({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    });
}

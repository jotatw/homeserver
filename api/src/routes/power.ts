import type { FastifyInstance } from "fastify";
import { getPower, setPower } from "../adapters/power.js";
import { sendOk, sendError, sendInternalError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function powerRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/power", async (_req, reply) => {
        return sendOk(reply, await getPower());
    });

    fastify.put("/api/v1/power", async (request, reply) => {
        const body = request.body as { shutdown?: string; wake?: string; enabled?: boolean };

        if (body.enabled !== false) {
            if (!body?.shutdown || !body?.wake) {
                return sendError(reply, 400, "shutdown e wake (HH:MM) são obrigatórios para ativar");
            }
        }

        try {
            const result = await setPower(
                body?.shutdown || "",
                body?.wake || "",
                body.enabled !== false,
            );
            return sendOk(reply, result);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });
}

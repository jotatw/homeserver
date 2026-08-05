import type { FastifyInstance } from "fastify";
import { checkUpdate, applyUpdate } from "../adapters/update.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function updateRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/update", async (_request, reply) => {
        try {
            return sendOk(reply, await checkUpdate());
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    fastify.post("/api/v1/update", async (request, reply) => {
        const body = request.body as { noRedeploy?: boolean };

        try {
            const result = await applyUpdate(body?.noRedeploy === true);
            return sendOk(reply, result);
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });
}

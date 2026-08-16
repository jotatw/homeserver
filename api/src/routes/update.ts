import type { FastifyInstance } from "fastify";
import { checkUpdate, applyUpdate, checkOsUpdate, applyOsUpdate } from "../adapters/update.js";
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

    // Pacotes do sistema (apt)
    fastify.get("/api/v1/update/os", async (_request, reply) => {
        try {
            return sendOk(reply, await checkOsUpdate());
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    fastify.post("/api/v1/update/os", async (_request, reply) => {
        try {
            return sendOk(reply, await applyOsUpdate());
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });
}

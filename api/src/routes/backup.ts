import type { FastifyInstance } from "fastify";
import { triggerBackup } from "../adapters/backup.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function backupRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.post("/api/v1/backup", async (_request, reply) => {
        try {
            const result = await triggerBackup();
            return sendOk(reply, result);
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });
}

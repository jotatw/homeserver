import type { FastifyInstance } from "fastify";
import { triggerBackup } from "../adapters/backup.js";
import { sendOk, sendInternalError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function backupRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.post("/api/v1/backup", async (request, reply) => {
        try {
            const result = await triggerBackup();
            return sendOk(reply, result);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });
}

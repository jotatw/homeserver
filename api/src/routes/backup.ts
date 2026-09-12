import type { FastifyInstance } from "fastify";
import { triggerBackup, getBackupStatus } from "../adapters/backup.js";
import { sendOk, sendInternalError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function backupRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    // Estado do último backup: data, integridade e frescor (core: hs system backup validate)
    fastify.get("/api/v1/backup/status", async (request, reply) => {
        try {
            return sendOk(reply, await getBackupStatus());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/backup", async (request, reply) => {
        try {
            const result = await triggerBackup();
            return sendOk(reply, result);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });
}

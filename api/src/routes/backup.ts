import type { FastifyInstance } from "fastify";
import { triggerBackup } from "../adapters/backup.js";

export async function backupRoutes(fastify: FastifyInstance) {
    fastify.post("/api/v1/backup", async (_request, reply) => {
        try {
            const result = await triggerBackup();
            return reply.send(result);
        } catch (error) {
            return reply.code(500).send({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    });
}

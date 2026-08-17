import type { FastifyInstance } from "fastify";
import {
    listModuleDefinitions,
    getModuleDefinition,
    listModuleInstances,
    runModuleOp,
} from "../adapters/modules.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

const OPERATIONS = new Set([
    "start",
    "stop",
    "restart",
    "enable",
    "disable",
    "update",
    "status",
]);

export async function moduleRoutes(fastify: FastifyInstance) {
    // Leitura: qualquer usuário autenticado (hook global).
    fastify.get("/api/v1/modules", async (_request, reply) => {
        try {
            return sendOk(reply, await listModuleDefinitions());
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    fastify.get("/api/v1/modules/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            return sendOk(reply, await getModuleDefinition(id));
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    // Instâncias e operações: somente admin.
    fastify.get("/api/v1/modules/instances", { preHandler: requireAdmin }, async (_request, reply) => {
        try {
            return sendOk(reply, await listModuleInstances());
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    fastify.post("/api/v1/modules/:id/op", { preHandler: requireAdmin }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as { op?: string } | null;

        if (!body?.op || !OPERATIONS.has(body.op)) {
            return sendError(reply, 400, "op inválida (start|stop|restart|enable|disable|update|status).");
        }

        try {
            return sendOk(reply, await runModuleOp(id, body.op));
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });
}
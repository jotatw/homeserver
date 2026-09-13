import type { FastifyInstance } from "fastify";
import {
    listModuleDefinitions,
    getModuleDefinition,
    listModuleInstances,
    addModuleInstance,
    removeModuleInstance,
    runModuleOp,
} from "../adapters/modules.js";
import { sendOk, sendError, sendInternalError } from "../utils/respond.js";
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
    fastify.get("/api/v1/modules", async (request, reply) => {
        try {
            return sendOk(reply, await listModuleDefinitions());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.get("/api/v1/modules/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            return sendOk(reply, await getModuleDefinition(id));
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    // Instâncias e operações: somente admin.
    fastify.get("/api/v1/modules/instances", { preHandler: requireAdmin }, async (request, reply) => {
        try {
            return sendOk(reply, await listModuleInstances());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    // Registro de instância (define "qual módulo roda com qual nome").
    fastify.post("/api/v1/modules/instances", { preHandler: requireAdmin }, async (request, reply) => {
        const body = request.body as { id?: string; name?: string } | null;

        if (!body?.id) {
            return sendError(reply, 400, "id é obrigatório.");
        }

        if (body.name && !/^[a-z0-9][a-z0-9-]*$/.test(body.name)) {
            return sendError(reply, 400, "name inválido (use slug [a-z0-9-]).");
        }

        try {
            return sendOk(reply, await addModuleInstance(body.id, body.name), 201);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.delete("/api/v1/modules/instances/:name", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };

        if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
            return sendError(reply, 400, "nome de instância inválido.");
        }

        try {
            return sendOk(reply, await removeModuleInstance(name));
        } catch (error) {
            return sendInternalError(reply, request.log, error);
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
            return sendInternalError(reply, request.log, error);
        }
    });
}

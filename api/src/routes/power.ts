import type { FastifyInstance } from "fastify";
import { getPower, setPower } from "../adapters/power.js";
import { sendOk, sendError, sendInternalError } from "../utils/respond.js";
import { requireAdmin, requireAuth } from "../plugins/auth.js";

export async function powerRoutes(fastify: FastifyInstance) {
    // preHandler EXPLÍCITO por rota: addHook de escopo se aplicaria a TODAS
    // as rotas do plugin (mesmo as registradas antes), negando o status.
    //
    // Leitura resumida para dashboards (homepage/App): autenticado
    // (sessão OU token de serviço), sem exigir admin. Os horários da
    // agenda não são sensíveis; a escrita fica admin-only abaixo.
    fastify.get("/api/v1/power/status", { preHandler: requireAuth }, async (_req, reply) => {
        return sendOk(reply, await getPower());
    });

    fastify.get("/api/v1/power", { preHandler: requireAdmin }, async (_req, reply) => {
        return sendOk(reply, await getPower());
    });

    fastify.put("/api/v1/power", { preHandler: requireAdmin }, async (request, reply) => {
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

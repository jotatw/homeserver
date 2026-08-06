import type { FastifyInstance } from "fastify";
import { createApiToken, listApiTokens, revokeApiToken } from "../tokens.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function tokenRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/tokens", async (_req, reply) => {
        try {
            return sendOk(reply, await listApiTokens());
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    fastify.post("/api/v1/tokens", async (request, reply) => {
        const body = request.body as { name?: string } | null;

        if (!body || !isNonEmptyString(body.name)) {
            return sendError(reply, 400, "name é obrigatório.");
        }

        try {
            const result = await createApiToken(body.name.trim());
            return sendOk(reply, { ...result.record, token: result.token }, 201);
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    fastify.delete("/api/v1/tokens/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            const revoked = await revokeApiToken(id);
            if (!revoked) {
                return sendError(reply, 404, "Token não encontrado.");
            }
            return sendOk(reply, { revoked: id });
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });
}

import type { FastifyInstance } from "fastify";
import { listPrinters, printText } from "../adapters/print.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function printRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/print", async (_req, reply) => {
        try {
            return sendOk(reply, { printers: await listPrinters() });
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });

    fastify.post("/api/v1/print", async (request, reply) => {
        const body = request.body as { text?: string; printer?: string } | null;

        if (!body || !isNonEmptyString(body.text)) {
            return sendError(reply, 400, "text é obrigatório.");
        }

        try {
            const result = await printText(body.text, body.printer || undefined);
            return sendOk(reply, result);
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });
}

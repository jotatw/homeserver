import type { FastifyInstance } from "fastify";
import { listPrinters, printContent, type PrintOptions } from "../adapters/print.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

interface PrintBody {
    text?: string;
    file?: { name?: string; data?: string };
    printer?: string;
    color?: "color" | "mono";
    media?: string;
    pages?: string;
    orientation?: "portrait" | "landscape";
}

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
        const body = request.body as PrintBody | null;

        const hasText = isNonEmptyString(body?.text);
        const fileData = body?.file?.data;
        const hasFile = typeof fileData === "string" && fileData.length > 0;

        if (!body || (!hasText && !hasFile)) {
            return sendError(reply, 400, "Envie 'text' ou 'file' (base64).");
        }

        const options: PrintOptions = {
            printer: isNonEmptyString(body.printer) ? body.printer : undefined,
            color: body.color,
            media: isNonEmptyString(body.media) ? body.media : undefined,
            pages: isNonEmptyString(body.pages) ? body.pages : undefined,
            orientation: body.orientation,
        };

        try {
            const result = await printContent(
                {
                    text: hasText ? body.text : undefined,
                    file: hasFile ? { name: body.file!.name, data: fileData } : undefined,
                },
                options,
            );
            return sendOk(reply, result);
        } catch (error) {
            return sendError(reply, 500, error instanceof Error ? error.message : String(error));
        }
    });
}

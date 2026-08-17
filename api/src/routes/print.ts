import type { FastifyInstance } from "fastify";
import {
    getPrintersInfo,
    printContent,
    listJobs,
    cancelJob,
    type PrintOptions,
} from "../adapters/print.js";
import { sendOk, sendError, sendInternalError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

interface PrintBody {
    text?: string;
    file?: { name?: string; data?: string };
    printer?: string;
    color?: "color" | "mono";
    media?: string;
    pages?: string;
    orientation?: "portrait" | "landscape";
    quality?: "economico" | "normal" | "alta";
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function printRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/print", async (request, reply) => {
        try {
            const info = await getPrintersInfo();
            const status: Record<string, unknown> = {};

            for (const p of info) {
                const { name, ...rest } = p;
                status[name] = rest;
            }

            return sendOk(reply, {
                printers: info.map((p) => p.name),
                status,
            });
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.get("/api/v1/print/jobs", async (request, reply) => {
        try {
            return sendOk(reply, { jobs: await listJobs() });
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.delete("/api/v1/print/jobs/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        if (!/^[A-Za-z0-9_.-]+-\d+$/.test(id)) {
            return sendError(reply, 400, "ID de trabalho inválido.");
        }

        try {
            return sendOk(reply, await cancelJob(id));
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/print", { bodyLimit: 30 * 1024 * 1024 }, async (request, reply) => {
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
            quality: body.quality,
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
            const message = error instanceof Error ? error.message : "";

            if (message.includes("limite de 20 MB")) {
                return sendError(reply, 400, "Arquivo acima do limite permitido de 20 MB.");
            }

            return sendInternalError(reply, request.log, error);
        }
    });
}

import { promises as fs } from "node:fs";
import path from "node:path";
import type { FastifyInstance } from "fastify";

const APP_DIR = path.join("/workspace", "api", "app");

const MIME: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/manifest+json",
    ".png": "image/png",
    ".svg": "image/svg+xml",
};

export async function appRoutes(fastify: FastifyInstance) {
    const serve = (file: string) => async (_req: unknown, reply: any) => {
        try {
            const content = await fs.readFile(path.join(APP_DIR, file));
            reply
                .type(MIME[path.extname(file)] ?? "application/octet-stream")
                .header("Cache-Control", "no-cache")
                .send(content);
        } catch {
            reply.code(404).send("Not found");
        }
    };

    fastify.get("/app", serve("index.html"));

    // Serve os estáticos do App (html/css/js/assets) em /app/<caminho>.
    fastify.get("/app/*", (req, reply) => {
        const file = (req.params as Record<string, string>)["*"] ?? "";

        // Apenas arquivos estáticos (sem path traversal).
        if (!file.includes(".") || file.includes("..") || file.startsWith("/")) {
            return reply.code(404).send("Not found");
        }

        return serve(file)(req, reply);
    });
}

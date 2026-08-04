import { promises as fs } from "node:fs";
import path from "node:path";
import type { FastifyInstance } from "fastify";

const APP_DIR = path.join("/workspace", "api", "app");

export async function appRoutes(fastify: FastifyInstance) {
    const serve = (file: string, type: string) => async (_req: unknown, reply: any) => {
        try {
            const content = await fs.readFile(path.join(APP_DIR, file));
            reply.type(type).send(content);
        } catch {
            reply.code(404).send("Not found");
        }
    };

    fastify.get("/app", serve("index.html", "text/html"));
    fastify.get("/app/login.html", serve("login.html", "text/html"));
    fastify.get("/app/app.js", serve("app.js", "application/javascript"));
    fastify.get("/app/auth.js", serve("auth.js", "application/javascript"));
    fastify.get("/app/style.css", serve("style.css", "text/css"));
}

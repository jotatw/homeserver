import type { FastifyInstance } from "fastify";
import { verifyCredentials } from "../adapters/auth.js";
import { createSession, destroySession, getSession } from "../sessions.js";
import { extractToken } from "../plugins/auth.js";

interface LoginBody {
    username: string;
    password: string;
}

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/api/v1/auth/login", async (request, reply) => {
        const body = request.body as LoginBody;

        if (!body?.username || !body?.password) {
            return reply
                .code(400)
                .send({ error: "username e password são obrigatórios." });
        }

        const result = await verifyCredentials(body.username, body.password);

        if (!result.ok) {
            return reply.code(401).send({ error: result.message });
        }

        const token = createSession(result.username!);

        return reply.code(200).send({
            token,
            username: result.username,
        });
    });

    fastify.post("/api/v1/auth/logout", async (request, reply) => {
        const token = extractToken(request);

        if (token) {
            destroySession(token);
        }

        return reply.code(200).send({ ok: true });
    });

    fastify.get("/api/v1/auth/session", async (request, reply) => {
        const token = extractToken(request);

        if (!token) {
            return reply.code(401).send({ error: "Autenticação necessária." });
        }

        const session = getSession(token);

        if (!session) {
            return reply.code(401).send({ error: "Sessão inválida ou expirada." });
        }

        return reply.code(200).send({
            username: session.username,
        });
    });
}

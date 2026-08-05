import type { FastifyInstance } from "fastify";
import { verifyCredentials } from "../adapters/auth.js";
import { createSession, destroySession, getSession } from "../sessions.js";
import { extractToken } from "../plugins/auth.js";
import { sendOk, sendError } from "../utils/respond.js";

interface LoginBody {
    username: string;
    password: string;
}

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/api/v1/auth/login", async (request, reply) => {
        const body = request.body as LoginBody;

        if (!body?.username || !body?.password) {
            return sendError(reply, 400, "username e password são obrigatórios.");
        }

        const result = await verifyCredentials(body.username, body.password);

        if (!result.ok) {
            return sendError(reply, 401, result.message || "Usuário ou senha inválidos.");
        }

        const token = createSession(result.username!);

        return sendOk(reply, {
            token,
            username: result.username,
        });
    });

    fastify.post("/api/v1/auth/logout", async (request, reply) => {
        const token = extractToken(request);

        if (token) {
            destroySession(token);
        }

        return sendOk(reply, { loggedOut: true });
    });

    fastify.get("/api/v1/auth/session", async (request, reply) => {
        const token = extractToken(request);

        if (!token) {
            return sendError(reply, 401, "Autenticação necessária.");
        }

        const session = getSession(token);

        if (!session) {
            return sendError(reply, 401, "Sessão inválida ou expirada.");
        }

        return sendOk(reply, {
            username: session.username,
        });
    });
}

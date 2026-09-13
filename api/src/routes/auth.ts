import type { FastifyInstance } from "fastify";
import { verifyCredentials, isAdmin } from "../adapters/auth.js";
import { changeUserPassword } from "../adapters/users.js";
import {
    createSession,
    destroySession,
    getSession,
    sessionExpiresIn,
} from "../sessions.js";
import { extractToken } from "../plugins/auth.js";
import { sendOk, sendError, sendInternalError } from "../utils/respond.js";

interface LoginBody {
    username: string;
    password: string;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/api/v1/auth/login", {
        config: {
            rateLimit: {
                max: 20,
                timeWindow: "1 minute",
            },
        },
    }, async (request, reply) => {
        const body = request.body as LoginBody | null;

        if (!body || !isNonEmptyString(body.username) || !isNonEmptyString(body.password)) {
            return sendError(reply, 400, "username e password são obrigatórios.");
        }

        const result = await verifyCredentials(body.username, body.password);

        if (!result.ok) {
            return sendError(reply, 401, result.message || "Usuário ou senha inválidos.");
        }

        const admin = await isAdmin(result.username!);
        const token = createSession(result.username!, admin);
        const session = getSession(token);

        return sendOk(reply, {
            token,
            user: {
                username: result.username,
                admin,
            },
            expiresIn: session ? sessionExpiresIn(session) : 0,
        });
    });

    fastify.post("/api/v1/auth/logout", async (request, reply) => {
        const token = extractToken(request);

        if (token) {
            destroySession(token);
        }

        return sendOk(reply, { loggedOut: true });
    });

    // Troca da própria senha. Sem guard admin: qualquer sessão válida pode
    // trocar a senha dela mesma; exige a senha atual como prova de posse.
    fastify.put("/api/v1/auth/change-password", {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: "1 minute",
            },
        },
    }, async (request, reply) => {
        const token = extractToken(request);
        const session = token ? getSession(token) : null;

        if (!session) {
            return sendError(reply, 401, "Sessão inválida ou expirada.");
        }

        const body = request.body as { currentPassword?: string; newPassword?: string };

        if (!isNonEmptyString(body?.currentPassword) || !isNonEmptyString(body?.newPassword)) {
            return sendError(reply, 400, "currentPassword e newPassword são obrigatórios.");
        }

        if (body.newPassword.length < 8) {
            return sendError(reply, 400, "A nova senha deve ter pelo menos 8 caracteres.");
        }

        const check = await verifyCredentials(session.username, body.currentPassword);

        if (!check.ok) {
            return sendError(reply, 403, "Senha atual incorreta.");
        }

        try {
            await changeUserPassword(session.username, body.newPassword);
        } catch {
            return sendInternalError(reply, request.log, new Error("change-password falhou"));
        }

        return sendOk(reply, { changed: true });
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
            user: {
                username: session.username,
                admin: session.admin,
            },
            expiresIn: sessionExpiresIn(session),
        });
    });
}

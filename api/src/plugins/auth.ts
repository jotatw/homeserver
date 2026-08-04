import type { FastifyReply, FastifyRequest } from "fastify";
import { getSession } from "../sessions.js";
import { isAdmin } from "../adapters/auth.js";

declare module "fastify" {
    interface FastifyRequest {
        user?: {
            username: string;
        };
    }
}

export function extractToken(request: FastifyRequest): string | null {
    const header = request.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return null;
    }

    return header.slice("Bearer ".length);
}

function isPublicPath(url: string): boolean {
    if (url === "/api/v1/auth/login") {
        return true;
    }

    if (url === "/app" || url.startsWith("/app/")) {
        return true;
    }

    return false;
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    if (isPublicPath(request.url)) {
        return;
    }

    const token = extractToken(request);

    if (!token) {
        return reply.code(401).send({ error: "Autenticação necessária." });
    }

    const session = getSession(token);

    if (!session) {
        return reply.code(401).send({ error: "Sessão inválida ou expirada." });
    }

    request.user = {
        username: session.username,
    };
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;

    if (!user) {
        return reply.code(401).send({ error: "Autenticação necessária." });
    }

    const admin = await isAdmin(user.username);

    if (!admin) {
        return reply.code(403).send({ error: "Acesso restrito a administradores." });
    }
}

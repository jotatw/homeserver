import type { FastifyReply, FastifyRequest } from "fastify";
import { getSession } from "../sessions.js";
import { findApiToken } from "../tokens.js";

declare module "fastify" {
    interface FastifyRequest {
        user?: {
            username: string;
            admin: boolean;
            authenticated: boolean;
            role: "admin" | "user";
        };
    }
}

const SERVICE_TOKEN = process.env.HS_SERVICE_TOKEN || "";

/**
 * Autenticação e autorização.
 *
 * - `authenticate()`: valida o token e resolve `request.user` (quem é).
 * - `authorize()`: decide se o usuário pode acessar (hoje: admin ou não).
 *
 * Separados conceitualmente para acomodar roles/permissões futuras sem
 * mudar a API pública. Nenhuma rota chama `verify()`/`isAdmin()` direto:
 * a role vem da sessão (resolvida uma única vez no login).
 */

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

    if (url === "/api/v1/version") {
        return true;
    }

    if (url === "/app" || url.startsWith("/app/")) {
        return true;
    }

    return false;
}

/**
 * Paths de leitura automática/polling.
 *
 * Estes GETs são consultados periodicamente pelo App (dashboard, status,
 * widgets). Não contam como atividade real do usuário: não renovam a sessão
 * (S2 do Security Hardening) para que polling não prolongue indefinidamente
 * a validade de uma sessão ociosa.
 */
function isPollingPath(url: string): boolean {
    return [
        "/api/v1/status",
        "/api/v1/events",
        "/api/v1/services",
        "/api/v1/services/status",
        "/api/v1/storage",
        "/api/v1/storage/status",
        "/api/v1/hardware",
        "/api/v1/power",
        "/api/v1/devices",
        "/api/v1/print",
        "/api/v1/print/jobs",
        "/api/v1/update",
        "/api/v1/update/os",
    ].includes(url);
}

type Outcome = { ok: true } | { ok: false; status: number; error: string };

function fail(status: number, error: string): Outcome {
    return { ok: false, status, error };
}

/** Resolve o token e popula `request.user`. */
async function authenticate(request: FastifyRequest): Promise<Outcome> {
    if (isPublicPath(request.url)) {
        return { ok: true };
    }

    const token = extractToken(request);

    if (!token) {
        return fail(401, "Autenticação necessária.");
    }

    // Token de serviço (integrações internas, ex.: homepage). Não é admin.
    if (SERVICE_TOKEN && token === SERVICE_TOKEN) {
        request.user = {
            username: "service",
            admin: false,
            authenticated: true,
            role: "user",
        };
        return { ok: true };
    }

    // Token de API (integrações externas). Não é admin.
    const apiToken = await findApiToken(token);

    if (apiToken) {
        request.user = {
            username: "token",
            admin: false,
            authenticated: true,
            role: "user",
        };
        return { ok: true };
    }

    const session = getSession(token, { renew: !isPollingPath(request.url) });

    if (!session) {
        return fail(401, "Sessão inválida ou expirada.");
    }

    request.user = {
        username: session.username,
        admin: session.admin,
        authenticated: true,
        role: session.admin ? "admin" : "user",
    };

    return { ok: true };
}

/** Decide se o usuário pode acessar a rota (hoje: admin ou autenticado). */
function authorize(
    user: FastifyRequest["user"],
    adminRequired: boolean,
): Outcome {
    if (!user) {
        return fail(401, "Autenticação necessária.");
    }

    if (adminRequired) {
        if (user.username === "service") {
            return fail(403, "Acesso restrito a administradores.");
        }

        if (!user.admin) {
            return fail(403, "Acesso restrito a administradores.");
        }
    }

    return { ok: true };
}

function replyWith(outcome: Outcome, reply: FastifyReply) {
    if (!outcome.ok) {
        return reply.code(outcome.status).send({
            ok: false,
            error: outcome.error,
        });
    }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    return replyWith(await authenticate(request), reply);
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
    const auth = await authenticate(request);

    if (!auth.ok) {
        return replyWith(auth, reply);
    }

    return replyWith(authorize(request.user, true), reply);
}

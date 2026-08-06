import { randomBytes } from "node:crypto";

/**
 * Sessões do HomeServer.
 *
 * Armazenamento: em memória (Map token -> Session).
 * Quando a persistência for necessária (v2.0+), basta trocar o Map
 * por um store (arquivo/banco) mantendo a mesma interface.
 *
 * TTL: 30 dias deslizante (sliding) — a sessão expira se ficar 30 dias
 * sem uso. Cada request válido renova o `lastUsedAt`. Adequado para LAN
 * (self-hosted), onde logout por inatividade curta é indesejado.
 *
 * `tokenVersion`: versão do token. Hoje sempre 1; no futuro permite
 * invalidar todas as sessões de um usuário (ex.: troca de senha) sem
 * mudar a estrutura da API.
 */

export interface Session {
    username: string;
    admin: boolean;
    createdAt: number;
    lastUsedAt: number;
    tokenVersion: number;
}

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const ttlFromEnv = Number.parseInt(process.env.HS_SESSION_TTL_MS ?? "", 10);
const SESSION_TTL_MS =
    Number.isFinite(ttlFromEnv) && ttlFromEnv > 0 ? ttlFromEnv : DEFAULT_TTL_MS;

const sessions = new Map<string, Session>();

export function createSession(username: string, admin: boolean): string {
    const token = randomBytes(32).toString("hex");
    const now = Date.now();

    sessions.set(token, {
        username,
        admin,
        createdAt: now,
        lastUsedAt: now,
        tokenVersion: 1,
    });

    return token;
}

export function getSession(token: string): Session | null {
    const session = sessions.get(token);

    if (!session) {
        return null;
    }

    const now = Date.now();

    if (now - session.lastUsedAt > SESSION_TTL_MS) {
        sessions.delete(token);
        return null;
    }

    session.lastUsedAt = now;

    return session;
}

export function destroySession(token: string): void {
    sessions.delete(token);
}

/** Segundos restantes de validade (após a última renovação por uso). */
export function sessionExpiresIn(session: Session): number {
    const remaining = SESSION_TTL_MS - (Date.now() - session.lastUsedAt);
    return Math.max(0, Math.ceil(remaining / 1000));
}

/** Apenas para testes unitários (ex.: expiração/sliding com TTL curto). */
export function _clearSessionsForTest(): void {
    sessions.clear();
}

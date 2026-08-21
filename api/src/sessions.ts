import { randomBytes } from "node:crypto";

/**
 * Sessões do HomeServer.
 *
 * Armazenamento: em memória (Map token -> Session).
 * Quando a persistência for necessária (v2.0+), basta trocar o Map
 * por um store (arquivo/banco) mantendo a mesma interface.
 *
 * Política (Security Hardening S2):
 * - `lastUserActivityAt`: renovado apenas por atividade real (não por polling).
 * - `expiresAt`: limite absoluto, independente de atividade. Nenhuma sessão
 *   permanece válida além desse limite.
 * - Inatividade expira conforme `HS_SESSION_TTL_MS` (padrão 30 dias).
 *
 * `tokenVersion`: versão do token. Hoje sempre 1; no futuro permite
 * invalidar todas as sessões de um usuário (ex.: troca de senha) sem
 * mudar a estrutura da API.
 */

export interface Session {
    username: string;
    admin: boolean;
    createdAt: number;
    lastUserActivityAt: number;
    expiresAt: number;
    tokenVersion: number;
}

export interface GetSessionOptions {
    /** Renova `lastUserActivityAt` (atividade real). Padrão: false. */
    renew?: boolean;
}

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_ABSOLUTE_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const ttlFromEnv = Number.parseInt(process.env.HS_SESSION_TTL_MS ?? "", 10);
const SESSION_TTL_MS =
    Number.isFinite(ttlFromEnv) && ttlFromEnv > 0 ? ttlFromEnv : DEFAULT_TTL_MS;

const absoluteFromEnv = Number.parseInt(process.env.HS_SESSION_ABSOLUTE_TTL_MS ?? "", 10);
const ABSOLUTE_TTL_MS =
    Number.isFinite(absoluteFromEnv) && absoluteFromEnv > 0
        ? absoluteFromEnv
        : DEFAULT_ABSOLUTE_TTL_MS;

const sessions = new Map<string, Session>();

export function createSession(username: string, admin: boolean): string {
    const token = randomBytes(32).toString("hex");
    const now = Date.now();

    sessions.set(token, {
        username,
        admin,
        createdAt: now,
        lastUserActivityAt: now,
        expiresAt: now + ABSOLUTE_TTL_MS,
        tokenVersion: 1,
    });

    return token;
}

/**
 * Valida uma sessão.
 *
 * - Expirada (absoluto ou inatividade) → remove e retorna null.
 * - Com `options.renew` → atualiza `lastUserActivityAt` (atividade real).
 * - Sem renovação → apenas validação (leitura/polling não mantém a sessão viva).
 */
export function getSession(
    token: string,
    options: GetSessionOptions = {}
): Session | null {
    const session = sessions.get(token);

    if (!session) {
        return null;
    }

    const now = Date.now();

    if (now >= session.expiresAt) {
        sessions.delete(token);
        return null;
    }

    if (now - session.lastUserActivityAt > SESSION_TTL_MS) {
        sessions.delete(token);
        return null;
    }

    if (options.renew) {
        session.lastUserActivityAt = now;
    }

    return session;
}

export function destroySession(token: string): void {
    sessions.delete(token);
}

/** Segundos restantes de validade (limite mais próximo: absoluto ou inatividade). */
export function sessionExpiresIn(session: Session): number {
    const now = Date.now();
    const remainingAbsolute = session.expiresAt - now;
    const remainingActivity = SESSION_TTL_MS - (now - session.lastUserActivityAt);
    const remaining = Math.min(remainingAbsolute, remainingActivity);
    return Math.max(0, Math.ceil(remaining / 1000));
}

/** Apenas para testes unitários (ex.: expiração/limites com TTL curto). */
export function _clearSessionsForTest(): void {
    sessions.clear();
}
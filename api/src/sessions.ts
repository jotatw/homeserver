import { randomBytes } from "node:crypto";

interface Session {
    username: string;
    createdAt: number;
}

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const sessions = new Map<string, Session>();

export function createSession(username: string): string {
    const token = randomBytes(32).toString("hex");

    sessions.set(token, {
        username,
        createdAt: Date.now(),
    });

    return token;
}

export function getSession(token: string): Session | null {
    const session = sessions.get(token);

    if (!session) {
        return null;
    }

    if (Date.now() - session.createdAt > SESSION_TTL_MS) {
        sessions.delete(token);
        return null;
    }

    return session;
}

export function destroySession(token: string): void {
    sessions.delete(token);
}

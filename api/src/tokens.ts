import { createHash, randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tokens de API para integrações externas.
 *
 * - Persistência: arquivo JSON em `api/data/tokens.json` (não versionado).
 * - Segurança: apenas o SHA-256 do token é armazenado (o arquivo pode vazar
 *   sem expor tokens válidos). O token completo é retornado UMA única vez
 *   na criação.
 * - Uso: `Authorization: Bearer <hs_token_...>` — autentica como integração
 *   (não admin), análogo ao `HS_SERVICE_TOKEN`.
 */

const DATA_DIR = path.join("/workspace", "api", "data");
const TOKENS_FILE = path.join(DATA_DIR, "tokens.json");

export interface ApiToken {
    id: string;
    name: string;
    prefix: string;
    createdAt: number;
    lastUsedAt: number | null;
}

interface Stored {
    name: string;
    prefix: string;
    createdAt: number;
    lastUsedAt: number | null;
}

let cache: Record<string, Stored> | null = null;

async function load(): Promise<Record<string, Stored>> {
    if (cache) {
        return cache;
    }

    try {
        const raw = await fs.readFile(TOKENS_FILE, "utf8");
        const parsed = JSON.parse(raw) as { tokens: Record<string, Stored> };
        cache = parsed.tokens ?? {};
    } catch {
        cache = {};
    }

    return cache;
}

async function persist(store: Record<string, Stored>): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(TOKENS_FILE, JSON.stringify({ tokens: store }, null, 2), {
        mode: 0o600,
    });
}

function hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

export function generateApiToken(): string {
    return "hs_token_" + randomBytes(24).toString("hex");
}

export async function createApiToken(name: string): Promise<{ token: string; record: ApiToken }> {
    const store = await load();
    const token = generateApiToken();
    const id = hash(token);
    const record: Stored = {
        name,
        prefix: token.slice(0, 15),
        createdAt: Date.now(),
        lastUsedAt: null,
    };

    store[id] = record;
    await persist(store);

    return { token, record: { id, ...record } };
}

export async function listApiTokens(): Promise<ApiToken[]> {
    const store = await load();
    return Object.entries(store).map(([id, r]) => ({ id, ...r }));
}

export async function revokeApiToken(id: string): Promise<boolean> {
    const store = await load();

    if (!store[id]) {
        return false;
    }

    delete store[id];
    await persist(store);

    return true;
}

export async function findApiToken(token: string): Promise<ApiToken | null> {
    const store = await load();
    const id = hash(token);
    const rec = store[id];

    if (!rec) {
        return null;
    }

    rec.lastUsedAt = Date.now();
    await persist(store);

    return { id, ...rec };
}

import { runHostModule } from "../utils/executor.js";

// Cada chamada do core sobe um container privilegiado via nsenter (~5-7s).
// Definições de módulo são estáticas; instâncias mudam raro e só via op()
// (que invalida o cache). TTLs longos evitam o subprocesso no hot path.
const defCache = new Map<string, { value: unknown; expires: number }>();
let instancesCache: { value: unknown; expires: number } | null = null;
const DEFS_TTL = 10 * 60 * 1000;
const INSTANCES_TTL = 30 * 1000;

export async function listModuleDefinitions(): Promise<unknown> {
    // Definições não aceitam argumento; cache por chave única.
    const key = "definitions";
    const now = Date.now();
    const hit = defCache.get(key);
    if (hit && hit.expires > now) return hit.value;
    const value = JSON.parse(await runHostModule("definitions"));
    defCache.set(key, { value, expires: now + DEFS_TTL });
    return value;
}

export async function getModuleDefinition(id: string): Promise<unknown> {
    const now = Date.now();
    const hit = defCache.get(id);
    if (hit && hit.expires > now) return hit.value;
    const value = JSON.parse(await runHostModule("info", id));
    defCache.set(id, { value, expires: now + DEFS_TTL });
    return value;
}

export async function listModuleInstances(): Promise<unknown> {
    const now = Date.now();
    if (instancesCache && instancesCache.expires > now) return instancesCache.value;
    const value = JSON.parse(await runHostModule("instances"));
    instancesCache = { value, expires: now + INSTANCES_TTL };
    return value;
}

export async function addModuleInstance(id: string, name?: string): Promise<unknown> {
    const extra: string[] = name ? [id, name] : [id];
    const value = JSON.parse(await runHostModule("instance", "add", ...extra));
    invalidateInstances();
    return value;
}

export async function removeModuleInstance(name: string): Promise<unknown> {
    const value = JSON.parse(await runHostModule("instance", "remove", name));
    invalidateInstances();
    return value;
}

function invalidateInstances(): void {
    instancesCache = null;
}

export async function runModuleOp(id: string, op: string): Promise<unknown> {
    const result = JSON.parse(await runHostModule("op", id, op));
    if (["start", "stop", "restart", "enable", "disable", "update", "install", "remove"].includes(op)) {
        invalidateInstances();
    }
    return result;
}
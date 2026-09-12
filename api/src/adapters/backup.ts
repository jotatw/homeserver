import { runHostBackup } from "../utils/executor.js";
import { runCore } from "../utils/cache.js";

export async function triggerBackup(): Promise<{ ok: boolean }> {
    return runHostBackup();
}

/**
 * Estado do último backup (core: hs system backup validate).
 * Inclui `freshness` — STALE quando o 'latest' não foi escrito hoje.
 */
export async function getBackupStatus(): Promise<Record<string, unknown>> {
    const raw = await runCore(["system", "backup", "validate"]);
    return JSON.parse(raw);
}

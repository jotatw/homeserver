import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

const cache = new Map<string, { value: string; expires: number }>();

/**
 * Executa um comando do core com cache TTL.
 * Usado nos endpoints de leitura para evitar subprocessos repetidos.
 */
export async function cachedRunCore(
    key: string,
    ttlMs: number,
    args: string[],
): Promise<string> {
    const now = Date.now();
    const hit = cache.get(key);

    if (hit && hit.expires > now) {
        return hit.value;
    }

    const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
    const value = stdout.trim();

    cache.set(key, { value, expires: now + ttlMs });

    return value;
}

export async function runCore(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
    return stdout.trim();
}

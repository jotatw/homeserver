import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cachedRunCore } from "../utils/cache.js";

const execFileAsync = promisify(execFile);

const RUNNER_IMAGE = "debian:bookworm-slim";
const CORE_ON_HOST = "/srv/git/homeserver/core/hs.sh";

export async function getDevices() {
    const raw = await cachedRunCore("devices", 10000, ["device", "status"]);
    return JSON.parse(raw);
}

/**
 * Ações de hardware (mount/unmount/eject) rodam no HOST via nsenter,
 * pois exigem sudo + systemd disponíveis no sistema hospedeiro
 * (padrão do backup.ts). O container da API não tem sudo/systemd.
 */
async function runOnHost(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync(
        "docker",
        [
            "run", "--rm", "--privileged", "--pid", "host",
            RUNNER_IMAGE,
            "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
            "bash", CORE_ON_HOST, ...args,
        ],
        { timeout: 60000 },
    );

    return stdout.trim();
}

export async function mountDevice(
    type: string,
    label: string,
    device: string,
): Promise<{ ok: boolean }> {
    await runOnHost(["device", "mount", type, label, device]);
    return { ok: true };
}

export async function unmountDevice(
    type: string,
    label: string,
): Promise<{ ok: boolean }> {
    await runOnHost(["device", "unmount", type, label]);
    return { ok: true };
}

export async function ejectDevice(device: string): Promise<{ ok: boolean }> {
    await runOnHost(["device", "eject", device]);
    return { ok: true };
}

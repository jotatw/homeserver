import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

async function runCore(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
    return stdout.trim();
}

export interface VersionInfo {
    current: string;
    latest: string;
    update: boolean;
}

export async function getVersion(): Promise<string> {
    return runCore(["version"]);
}

export async function checkUpdate(): Promise<VersionInfo> {
    const raw = await runCore(["update", "check"]);
    return JSON.parse(raw) as VersionInfo;
}

export async function applyUpdate(noRedeploy: boolean): Promise<Record<string, string>> {
    const args = ["update", "apply"];
    if (noRedeploy) {
        args.push("--no-redeploy");
    }

    try {
        const raw = await runCore(args);
        const parsed = JSON.parse(raw) as Record<string, string>;
        return parsed;
    } catch (error) {
        const err = error as { stdout?: string };
        throw new Error(err.stdout?.trim() || "Falha ao aplicar a atualização.");
    }
}

/**
 * Operações de pacotes do sistema (apt) rodam no HOST via nsenter,
 * pois exigem root (padrão do power/devices). O container da API
 * não tem privilégios para apt.
 */
async function runOnHost(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync(
        "docker",
        [
            "run", "--rm", "--privileged", "--pid", "host",
            "debian:bookworm-slim",
            "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
            "bash", "/srv/git/homeserver/core/hs.sh", ...args,
        ],
        { timeout: 600000 },
    );

    return stdout.trim();
}

export interface OsUpdateInfo {
    upgradable: number;
    reboot: boolean;
    refresh: boolean;
}

export async function checkOsUpdate(): Promise<OsUpdateInfo> {
    const raw = await runOnHost(["update", "os", "check"]);
    return JSON.parse(raw) as OsUpdateInfo;
}

export async function applyOsUpdate(): Promise<Record<string, boolean | number>> {
    const raw = await runOnHost(["update", "os", "apply"]);
    return JSON.parse(raw) as Record<string, boolean | number>;
}

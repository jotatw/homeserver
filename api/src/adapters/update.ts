import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { runHostUpdate } from "../utils/executor.js";

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

export interface OsUpdateInfo {
    upgradable: number;
    reboot: boolean;
    refresh: boolean;
}

export async function checkOsUpdate(): Promise<OsUpdateInfo> {
    const raw = await runHostUpdate("check");
    return JSON.parse(raw) as OsUpdateInfo;
}

export async function applyOsUpdate(): Promise<Record<string, boolean | number>> {
    const raw = await runHostUpdate("apply");
    return JSON.parse(raw) as Record<string, boolean | number>;
}
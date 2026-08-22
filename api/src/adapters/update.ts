import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { runHostUpdate } from "../utils/executor.js";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

async function runCore(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
    return stdout.trim();
}

export type UpdateStatus =
    | "up_to_date"
    | "update_available"
    | "modified"
    | "ahead"
    | "diverged"
    | "unavailable";

export interface UpdateInfo {
    status: UpdateStatus;
    current: string;
    latest: string;
    ahead: number;
    behind: number;
    dirty: boolean;
    update: boolean;
}

export async function getVersion(): Promise<string> {
    return runCore(["version"]);
}

export async function checkUpdate(): Promise<UpdateInfo> {
    const raw = await runCore(["update", "check"]);
    return JSON.parse(raw) as UpdateInfo;
}

export interface UpdateApplyResult {
    from: string;
    to: string;
    recovery: string;
}

export async function applyUpdate(): Promise<UpdateApplyResult> {
    try {
        const raw = await runCore(["update", "apply"]);
        return JSON.parse(raw) as UpdateApplyResult;
    } catch (error) {
        const err = error as { stdout?: string; stderr?: string };
        throw new Error(
            err.stderr?.trim() || err.stdout?.trim() || "Falha ao aplicar a atualização."
        );
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

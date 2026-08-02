import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

async function runCore(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
    return stdout.trim();
}

export async function getHostname(): Promise<string> {
    return runCore(["system", "hostname"]);
}

export interface ServiceState {
    name: string;
    status: string;
}

export interface SystemStatus {
    hostname: string;
    os: string;
    kernel: string;
    architecture: string;
    uptime: string;
    load: string;
    cpu: { percent: number };
    memory: { total: number; used: number; available: number; percent: number };
    disk: { total: number; used: number; available: number; percent: number };
    services: ServiceState[];
    backup: string;
}

export async function getSystemStatus(): Promise<SystemStatus> {
    const raw = await runCore(["system", "status"]);
    return JSON.parse(raw) as SystemStatus;
}

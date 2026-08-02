import { cachedRunCore, runCore } from "../utils/cache.js";

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
    const raw = await cachedRunCore("status", 10000, ["system", "status"]);
    return JSON.parse(raw) as SystemStatus;
}

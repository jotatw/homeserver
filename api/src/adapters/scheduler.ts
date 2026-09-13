import { runHostScheduler } from "../utils/executor.js";

export async function statusScheduler() {
    return runHostScheduler("status");
}

export async function enableSchedulerTask(name: string) {
    return runHostScheduler("enable", name);
}

export async function disableSchedulerTask(name: string) {
    return runHostScheduler("disable", name);
}

export async function runSchedulerTask(name: string) {
    return runHostScheduler("run", name);
}

export async function logSchedulerTask(name: string, lines: number): Promise<string> {
    return runHostScheduler("log", name, String(lines));
}

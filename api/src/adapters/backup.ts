import { runHostBackup } from "../utils/executor.js";

export async function triggerBackup(): Promise<{ ok: boolean }> {
    return runHostBackup();
}
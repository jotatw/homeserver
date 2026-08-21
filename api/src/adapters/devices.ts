import { cachedRunCore } from "../utils/cache.js";
import { runHostDevice } from "../utils/executor.js";

export async function getDevices() {
    const raw = await cachedRunCore("devices", 10000, ["device", "status"]);
    return JSON.parse(raw);
}

export async function mountDevice(
    type: string,
    label: string,
    device: string,
): Promise<{ ok: boolean }> {
    await runHostDevice("mount", type, label, device);
    return { ok: true };
}

export async function unmountDevice(
    type: string,
    label: string,
): Promise<{ ok: boolean }> {
    await runHostDevice("unmount", type, label);
    return { ok: true };
}

export async function ejectDevice(device: string): Promise<{ ok: boolean }> {
    await runHostDevice("eject", device);
    return { ok: true };
}
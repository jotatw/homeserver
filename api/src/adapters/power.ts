import { cachedRunCore, runCore } from "../utils/cache.js";
import { runHostPower } from "../utils/executor.js";

export async function getPower() {
    const raw = await cachedRunCore("power", 10000, ["power", "status"]);
    return JSON.parse(raw);
}

export async function setPower(shutdown: string, wake: string, enabled: boolean) {
    if (enabled) {
        await runHostPower("set", shutdown, wake);
    } else {
        await runHostPower("disable");
    }
    return getPower();
}
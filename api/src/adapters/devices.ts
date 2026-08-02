import { cachedRunCore } from "../utils/cache.js";

export async function getDevices() {
    const raw = await cachedRunCore("devices", 10000, ["device", "status"]);
    return JSON.parse(raw);
}

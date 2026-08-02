import { cachedRunCore } from "../utils/cache.js";

export async function getHardware() {
    const raw = await cachedRunCore("hardware", 30000, ["hardware", "status"]);
    return JSON.parse(raw);
}

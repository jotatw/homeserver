import { cachedRunCore } from "../utils/cache.js";

export async function getStorageStatus() {
    const raw = await cachedRunCore("storage", 5000, ["system", "storage", "status"]);
    return JSON.parse(raw);
}

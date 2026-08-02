import { cachedRunCore } from "../utils/cache.js";

export async function getEvents() {
    const raw = await cachedRunCore("events", 15000, ["system", "events"]);
    return JSON.parse(raw);
}

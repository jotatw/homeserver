import { cachedRunCore, runCore } from "../utils/cache.js";

export async function getServices() {
    const raw = await cachedRunCore("services", 10000, ["system", "services"]);
    return JSON.parse(raw);
}

export async function serviceOp(name: string, op: "start" | "stop" | "restart" | "enable" | "disable") {
    const raw = await runCore(["service", name, op]);
    return JSON.parse(raw);
}

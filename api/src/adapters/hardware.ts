import { cachedRunCore } from "../utils/cache.js";

export async function getHardware() {
    const raw = await cachedRunCore("hardware", 30000, ["hardware", "status"]);
    return JSON.parse(raw);
}

/**
 * Somente sensores de temperatura — superfície read-only para integrações
 * internas (widget Sensores do portal). O inventário completo (USB, rede,
 * SMART) permanece admin-only em GET /api/v1/hardware (ADR-0010).
 */
export async function getSensors() {
    const data = await getHardware();
    return { temperature: data.temperature ?? [] };
}

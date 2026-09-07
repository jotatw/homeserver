import type { FastifyInstance } from "fastify";
import { getHardware, getSensors } from "../adapters/hardware.js";
import { sendOk } from "../utils/respond.js";
import { requireAdmin, requireAuth } from "../plugins/auth.js";

export async function hardwareRoutes(fastify: FastifyInstance) {
    // preHandler EXPLÍCITO por rota: addHook de escopo se aplicaria a TODAS
    // (mesmo padrão de power.ts).
    fastify.get("/api/v1/hardware", { preHandler: requireAdmin }, async (_req, reply) => {
        return sendOk(reply, await getHardware());
    });

    // Leitura de temperatura para o portal (widget Sensores usa o token de
    // servico, que nao e admin). Inventario completo permanece admin-only.
    fastify.get("/api/v1/hardware/sensors", { preHandler: requireAuth }, async (_req, reply) => {
        return sendOk(reply, await getSensors());
    });
}

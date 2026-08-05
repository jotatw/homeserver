import type { FastifyInstance } from "fastify";
import { getHardware } from "../adapters/hardware.js";
import { sendOk } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function hardwareRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/hardware", async (_req, reply) => {
        return sendOk(reply, await getHardware());
    });
}

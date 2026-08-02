import type { FastifyInstance } from "fastify";
import { getHardware } from "../adapters/hardware.js";

export async function hardwareRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/hardware", async () => {
        return getHardware();
    });
}

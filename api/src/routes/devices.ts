import type { FastifyInstance } from "fastify";
import { getDevices } from "../adapters/devices.js";

export async function devicesRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/devices", async () => {
        return getDevices();
    });
}

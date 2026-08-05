import type { FastifyInstance } from "fastify";
import { getDevices } from "../adapters/devices.js";
import { sendOk } from "../utils/respond.js";

export async function devicesRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/devices", async (_req, reply) => {
        return sendOk(reply, await getDevices());
    });
}

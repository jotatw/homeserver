import type { FastifyInstance } from "fastify";
import { getServices } from "../adapters/services.js";
import { sendOk } from "../utils/respond.js";

export async function servicesRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/services", async (_req, reply) => {
        return sendOk(reply, await getServices());
    });

    fastify.get("/api/v1/services/status", async (_req, reply) => {
        return sendOk(reply, await getServices());
    });
}

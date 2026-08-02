import type { FastifyInstance } from "fastify";
import { getServices } from "../adapters/services.js";

export async function servicesRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/services", async () => {
        return getServices();
    });

    fastify.get("/api/v1/services/status", async () => {
        return getServices();
    });
}

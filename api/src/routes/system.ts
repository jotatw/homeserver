import type { FastifyInstance } from "fastify";
import { getHostname, getSystemStatus } from "../adapters/system.js";

export async function systemRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/system", async () => {
        return {
            hostname: await getHostname(),
        };
    });

    fastify.get("/api/v1/status", async () => {
        return getSystemStatus();
    });
}

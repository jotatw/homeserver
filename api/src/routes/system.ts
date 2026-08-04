import type { FastifyInstance } from "fastify";
import { getHostname, getSystemStatus } from "../adapters/system.js";
import { getVersion } from "../adapters/update.js";

export async function systemRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/system", async () => {
        return {
            hostname: await getHostname(),
        };
    });

    fastify.get("/api/v1/status", async () => {
        return getSystemStatus();
    });

    fastify.get("/api/v1/version", async () => {
        return { version: await getVersion() };
    });
}

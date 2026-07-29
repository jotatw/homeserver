import type { FastifyInstance } from "fastify";
import { getHostname } from "../adapters/system.js";

export async function systemRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/system", async () => {
        return {
            hostname: await getHostname(),
        };
    });
}
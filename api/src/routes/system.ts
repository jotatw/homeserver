import type { FastifyInstance } from "fastify";
import { getHostname, getSystemStatus } from "../adapters/system.js";
import { getVersion } from "../adapters/update.js";
import { sendOk } from "../utils/respond.js";

export async function systemRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/system", async (_req, reply) => {
        return sendOk(reply, { hostname: await getHostname() });
    });

    fastify.get("/api/v1/status", async (_req, reply) => {
        return sendOk(reply, await getSystemStatus());
    });

    fastify.get("/api/v1/version", async (_req, reply) => {
        return sendOk(reply, { version: await getVersion() });
    });
}

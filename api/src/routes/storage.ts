import type { FastifyInstance } from "fastify";
import { getStorageStatus } from "../adapters/storage.js";
import { sendOk } from "../utils/respond.js";

export async function storageRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/storage", async (_req, reply) => {
        return sendOk(reply, await getStorageStatus());
    });

    fastify.get("/api/v1/storage/status", async (_req, reply) => {
        return sendOk(reply, await getStorageStatus());
    });
}

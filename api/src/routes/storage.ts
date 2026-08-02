import type { FastifyInstance } from "fastify";
import { getStorageStatus } from "../adapters/storage.js";

export async function storageRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/storage", async () => {
        return getStorageStatus();
    });

    fastify.get("/api/v1/storage/status", async () => {
        return getStorageStatus();
    });
}

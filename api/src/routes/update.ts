import type { FastifyInstance } from "fastify";
import { checkUpdate, applyUpdate, checkOsUpdate, applyOsUpdate } from "../adapters/update.js";
import { sendOk, sendInternalError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function updateRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/update", async (request, reply) => {
        try {
            return sendOk(reply, await checkUpdate());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/update", async (request, reply) => {
        try {
            const result = await applyUpdate();
            return sendOk(reply, result);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    // Pacotes do sistema (apt)
    fastify.get("/api/v1/update/os", async (request, reply) => {
        try {
            return sendOk(reply, await checkOsUpdate());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/update/os", async (request, reply) => {
        try {
            return sendOk(reply, await applyOsUpdate());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });
}

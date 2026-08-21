import type { FastifyInstance } from "fastify";
import { getServices, serviceOp } from "../adapters/services.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function servicesRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/services", async (_req, reply) => {
        return sendOk(reply, await getServices());
    });

    fastify.get("/api/v1/services/status", async (_req, reply) => {
        return sendOk(reply, await getServices());
    });

    fastify.post("/api/v1/services/:name/start", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await serviceOp(name, "start"));
    });

    fastify.post("/api/v1/services/:name/stop", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await serviceOp(name, "stop"));
    });

    fastify.post("/api/v1/services/:name/restart", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await serviceOp(name, "restart"));
    });

    fastify.post("/api/v1/services/:name/enable", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await serviceOp(name, "enable"));
    });

    fastify.post("/api/v1/services/:name/disable", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await serviceOp(name, "disable"));
    });
}

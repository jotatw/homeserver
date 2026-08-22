import type { FastifyInstance } from "fastify";
import { statusScheduler, enableSchedulerTask, disableSchedulerTask, runSchedulerTask } from "../adapters/scheduler.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function schedulerRoutes(fastify: FastifyInstance) {
    // GET /api/v1/scheduler — lista em JSON (consumido pelo App)
    fastify.get("/api/v1/scheduler", { preHandler: requireAdmin }, async (request, reply) => {
        const raw = await statusScheduler();
        try {
            return sendOk(reply, JSON.parse(raw));
        } catch {
            return sendOk(reply, raw);
        }
    });

    fastify.get("/api/v1/scheduler/status", { preHandler: requireAdmin }, async (request, reply) => {
        return sendOk(reply, await statusScheduler());
    });

    fastify.post("/api/v1/scheduler/:name/enable", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await enableSchedulerTask(name));
    });

    fastify.post("/api/v1/scheduler/:name/disable", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await disableSchedulerTask(name));
    });

    fastify.post("/api/v1/scheduler/:name/run", { preHandler: requireAdmin }, async (request, reply) => {
        const { name } = request.params as { name: string };
        return sendOk(reply, await runSchedulerTask(name));
    });
}
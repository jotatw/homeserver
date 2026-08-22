import type { FastifyInstance } from "fastify";
import { listScheduler, statusScheduler, enableSchedulerTask, disableSchedulerTask, runSchedulerTask } from "../adapters/scheduler.js";
import { sendOk, sendError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function schedulerRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/scheduler", { preHandler: requireAdmin }, async (request, reply) => {
        return sendOk(reply, await listScheduler());
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
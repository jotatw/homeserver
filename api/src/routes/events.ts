import type { FastifyInstance } from "fastify";
import { getEvents } from "../adapters/events.js";
import { sendOk } from "../utils/respond.js";

export async function eventsRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/events", async (_req, reply) => {
        return sendOk(reply, await getEvents());
    });
}

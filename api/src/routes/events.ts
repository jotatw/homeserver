import type { FastifyInstance } from "fastify";
import { getEvents } from "../adapters/events.js";

export async function eventsRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/events", async () => {
        return getEvents();
    });
}

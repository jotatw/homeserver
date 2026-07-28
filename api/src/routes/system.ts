import { FastifyInstance } from "fastify";

export async function systemRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/system", async () => {
        return {
            status: "ok"
        };
    });
}
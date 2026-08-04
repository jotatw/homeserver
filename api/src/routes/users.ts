import type { FastifyInstance } from "fastify";
import { createUser, listUsers, deleteUser, changeUserPassword } from "../adapters/users.js";
import { requireAdmin } from "../plugins/auth.js";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/users", async () => {
        return listUsers();
    });

    fastify.post("/api/v1/users", async (request, reply) => {
        const body = request.body as {
            username?: string;
            password?: string;
            email?: string;
            gitea?: boolean;
        };

        if (!body?.username) {
            return reply.code(400).send({ error: "username é obrigatório" });
        }

        try {
            const user = await createUser({
                username: body.username,
                password: body.password,
                email: body.email,
                gitea: body.gitea,
            });

            return reply.code(201).send(user);
        } catch (error) {
            return reply.code(500).send({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    });

    fastify.put("/api/v1/users/:username", async (request, reply) => {
        const { username } = request.params as { username: string };
        const body = request.body as { password?: string };

        if (!body?.password) {
            return reply.code(400).send({ error: "password é obrigatório" });
        }

        try {
            const result = await changeUserPassword(username, body.password);
            return reply.send(result);
        } catch (error) {
            return reply.code(500).send({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    });

    fastify.delete("/api/v1/users/:username", async (request, reply) => {
        const { username } = request.params as { username: string };
        const { folder } = request.query as { folder?: string };
        const removeFolder = folder === "1" || folder === "true";

        try {
            await deleteUser(username, removeFolder);
            return { ok: true };
        } catch (error) {
            return reply.code(500).send({
                error: error instanceof Error ? error.message : String(error),
            });
        }
    });
}

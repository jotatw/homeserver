import type { FastifyInstance } from "fastify";
import { createUser, listUsers, deleteUser, changeUserPassword } from "../adapters/users.js";
import { sendOk, sendError, sendInternalError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", requireAdmin);

    fastify.get("/api/v1/users", async (request, reply) => {
        try {
            return sendOk(reply, await listUsers());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/users", async (request, reply) => {
        const body = request.body as {
            username?: string;
            password?: string;
            email?: string;
            gitea?: boolean;
        };

        if (!body?.username) {
            return sendError(reply, 400, "username é obrigatório");
        }

        try {
            const user = await createUser({
                username: body.username,
                password: body.password,
                email: body.email,
                gitea: body.gitea,
            });

            return sendOk(reply, user, 201);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.put("/api/v1/users/:username", async (request, reply) => {
        const { username } = request.params as { username: string };
        const body = request.body as { password?: string };

        if (!body?.password) {
            return sendError(reply, 400, "password é obrigatório");
        }

        try {
            const result = await changeUserPassword(username, body.password);
            return sendOk(reply, result);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.delete("/api/v1/users/:username", async (request, reply) => {
        const { username } = request.params as { username: string };
        const { folder } = request.query as { folder?: string };
        const removeFolder = folder === "1" || folder === "true";

        try {
            await deleteUser(username, removeFolder);
            return sendOk(reply, { deleted: username });
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });
}

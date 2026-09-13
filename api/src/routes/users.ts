import type { FastifyInstance } from "fastify";
import { createUser, listUsers, deleteUser, changeUserPassword, setUserAdmin } from "../adapters/users.js";
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
            admin?: boolean;
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
                admin: body.admin,
            });

            return sendOk(reply, user, 201);
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.put("/api/v1/users/:username", async (request, reply) => {
        const { username } = request.params as { username: string };
        const body = request.body as { password?: string; admin?: boolean };

        const hasPassword = typeof body?.password === "string" && body.password.length > 0;
        const adminFlag: boolean | undefined = body?.admin;
        const hasAdmin = typeof adminFlag === "boolean";

        if (!hasPassword && !hasAdmin) {
            return sendError(reply, 400, "Informe password e/ou admin.");
        }

        try {
            const result: Record<string, unknown> = { username };

            if (hasPassword) {
                await changeUserPassword(username, body.password!);
                result.passwordChanged = true;
            }

            if (hasAdmin) {
                const sessionUser = request.user;
                if (sessionUser && sessionUser.username === username && adminFlag === false) {
                    return sendError(reply, 400, "Não é possível remover o próprio acesso de administrador.");
                }
                await setUserAdmin(username, adminFlag!);
                result.admin = adminFlag;
            }

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

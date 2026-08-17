import type { FastifyInstance } from "fastify";
import { getDevices, mountDevice, unmountDevice, ejectDevice } from "../adapters/devices.js";
import { sendOk, sendError, sendInternalError } from "../utils/respond.js";
import { requireAdmin } from "../plugins/auth.js";

interface DeviceActionBody {
    type?: string;
    label?: string;
    device?: string;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function devicesRoutes(fastify: FastifyInstance) {
    fastify.get("/api/v1/devices", async (request, reply) => {
        try {
            return sendOk(reply, await getDevices());
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/devices/mount", { preHandler: requireAdmin }, async (request, reply) => {
        const body = request.body as DeviceActionBody | null;

        if (!body || !isNonEmptyString(body.type) || !isNonEmptyString(body.label) || !isNonEmptyString(body.device)) {
            return sendError(reply, 400, "type, label e device são obrigatórios.");
        }

        try {
            return sendOk(reply, await mountDevice(body.type!, body.label!, body.device!));
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/devices/unmount", { preHandler: requireAdmin }, async (request, reply) => {
        const body = request.body as DeviceActionBody | null;

        if (!body || !isNonEmptyString(body.type) || !isNonEmptyString(body.label)) {
            return sendError(reply, 400, "type e label são obrigatórios.");
        }

        try {
            return sendOk(reply, await unmountDevice(body.type!, body.label!));
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });

    fastify.post("/api/v1/devices/eject", { preHandler: requireAdmin }, async (request, reply) => {
        const body = request.body as DeviceActionBody | null;

        if (!body || !isNonEmptyString(body.device)) {
            return sendError(reply, 400, "device é obrigatório.");
        }

        try {
            return sendOk(reply, await ejectDevice(body.device!));
        } catch (error) {
            return sendInternalError(reply, request.log, error);
        }
    });
}

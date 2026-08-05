import type { FastifyReply } from "fastify";

/**
 * Resposta padronizada do HomeServer API.
 *
 * Sucesso: { ok: true, data: <payload> }
 * Erro:   { ok: false, error: "<mensagem>" }
 *
 * Toda rota deve responder através destes helpers para manter
 * um contrato consistente (v1.5 Sprint 1).
 */

export function sendOk(reply: FastifyReply, data: unknown, status = 200) {
    return reply.code(status).send({ ok: true, data });
}

export function sendError(
    reply: FastifyReply,
    status: number,
    message: string,
) {
    return reply.code(status).send({ ok: false, error: message });
}

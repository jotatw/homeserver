import type { FastifyBaseLogger, FastifyReply } from "fastify";

/**
 * Resposta padronizada do HomeServer API.
 *
 * Sucesso: { ok: true, data: <payload> }
 * Erro:   { ok: false, error: "<mensagem>" }
 *
 * Toda rota deve responder através destes helpers para manter
 * um contrato consistente.
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

/**
 * Registra o detalhe interno e devolve uma mensagem segura ao cliente.
 *
 * Use apenas para falhas inesperadas. Erros conhecidos de validação e
 * recursos inexistentes devem continuar usando sendError() com o status
 * HTTP e a mensagem pública apropriados.
 */
export function sendInternalError(
    reply: FastifyReply,
    logger: FastifyBaseLogger,
    error: unknown,
    message = "Não foi possível concluir a operação.",
) {
    logger.error({ err: error }, "Unexpected internal error");
    return sendError(reply, 500, message);
}

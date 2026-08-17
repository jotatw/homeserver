import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const RUNNER_IMAGE = "debian:bookworm-slim";
const CORE_ON_HOST = "/srv/git/homeserver/core/hs.sh";

/**
 * Module Core roda no HOST via nsenter: o container da API não possui
 * python3 (necessário para ler/validar as Definitions em JSON) e as
 * operações escrevem estado como root em /srv/config/modules.
 */
async function runOnHost(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync(
        "docker",
        [
            "run", "--rm", "--privileged", "--pid", "host",
            RUNNER_IMAGE,
            "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
            "bash", CORE_ON_HOST, ...args,
        ],
        { timeout: 120000 },
    );

    return stdout.trim();
}

export async function listModuleDefinitions(): Promise<unknown> {
    return JSON.parse(await runOnHost(["module", "definitions"]));
}

export async function getModuleDefinition(id: string): Promise<unknown> {
    return JSON.parse(await runOnHost(["module", "info", id]));
}

export async function listModuleInstances(): Promise<unknown> {
    return JSON.parse(await runOnHost(["module", "instances"]));
}

export async function runModuleOp(id: string, op: string): Promise<unknown> {
    const raw = await runOnHost(["module", "op", id, op]);
    return JSON.parse(raw);
}
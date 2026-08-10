import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const RUNNER_IMAGE = "debian:bookworm-slim";
const CONTAINER_DATA = path.join("/workspace", "api", "data");
const HOST_DATA = "/srv/git/homeserver/api/data";
const JOB_FILE = "print-job.txt";

/**
 * Impressão via CUPS do HOST.
 *
 * O CUPS roda no sistema hospedeiro. A API roda em container sem acesso ao
 * socket do CUPS, então os comandos `lp`/`lpstat` são executados no host via
 * nsenter (mesmo padrão de backup.ts/devices.ts).
 *
 * O texto é escrito em `api/data/` (gitignored), que é montado no host,
 * e impresso com `lp`.
 */
async function runOnHost(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync(
        "docker",
        [
            "run", "--rm", "--privileged", "--pid", "host",
            RUNNER_IMAGE,
            "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
            ...args,
        ],
        { timeout: 90000 },
    );

    return stdout.trim();
}

export async function listPrinters(): Promise<string[]> {
    const raw = await runOnHost(["lpstat", "-p"]);

    return raw
        .split("\n")
        .map((line) => line.match(/^printer (\S+)/)?.[1])
        .filter((name): name is string => Boolean(name));
}

export async function printText(
    text: string,
    printer = "MG3110",
): Promise<{ ok: boolean }> {
    await fs.mkdir(CONTAINER_DATA, { recursive: true });
    await fs.writeFile(path.join(CONTAINER_DATA, JOB_FILE), text);

    await runOnHost([
        "lp", "-d", printer, "-o", "media=A4",
        path.join(HOST_DATA, JOB_FILE),
    ]);

    return { ok: true };
}

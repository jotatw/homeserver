import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const RUNNER_IMAGE = "debian:bookworm-slim";
const CONTAINER_DATA = path.join("/workspace", "api", "data");
const HOST_DATA = "/srv/git/homeserver/api/data";

/**
 * Impressão via CUPS do HOST.
 *
 * O CUPS roda no sistema hospedeiro. A API roda em container sem acesso ao
 * socket do CUPS, então os comandos `lp`/`lpstat` são executados no host via
 * nsenter (mesmo padrão de backup.ts/devices.ts).
 *
 * O conteúdo (texto ou arquivo) é escrito em `api/data/` (gitignored), que é
 * montado no host, e impresso com `lp` e as opções solicitadas.
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
        { timeout: 120000 },
    );

    return stdout.trim();
}

export interface PrintOptions {
    printer?: string;
    color?: "color" | "mono";
    media?: string;
    pages?: string;
    orientation?: "portrait" | "landscape";
}

export interface PrintContent {
    text?: string;
    file?: {
        name?: string;
        data: string; // base64
    };
}

function lpOptions(opts: PrintOptions): string[] {
    const args: string[] = [];

    if (opts.media) {
        args.push("-o", `media=${opts.media}`);
    }
    if (opts.color === "mono") {
        args.push("-o", "print-color-mode=monochrome");
    }
    if (opts.pages) {
        args.push("-o", `page-ranges=${opts.pages}`);
    }
    if (opts.orientation === "landscape") {
        args.push("-o", "orientation-requested=6");
    }

    return args;
}

export async function listPrinters(): Promise<string[]> {
    const raw = await runOnHost(["lpstat", "-p"]);

    return raw
        .split("\n")
        .map((line) => line.match(/^printer (\S+)/)?.[1])
        .filter((name): name is string => Boolean(name));
}

export async function printContent(
    content: PrintContent,
    opts: PrintOptions = {},
): Promise<{ ok: boolean; file?: string }> {
    await fs.mkdir(CONTAINER_DATA, { recursive: true });

    let fileName = "print-job.txt";

    if (content.file?.data) {
        // Arquivo enviado em base64.
        const name = content.file.name || "print-job.pdf";
        const safe = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
        fileName = safe;
        await fs.writeFile(path.join(CONTAINER_DATA, fileName), Buffer.from(content.file.data, "base64"));
    } else {
        await fs.writeFile(path.join(CONTAINER_DATA, fileName), content.text ?? "");
    }

    const printer = opts.printer || "MG3110";

    await runOnHost([
        "lp", "-d", printer, ...lpOptions(opts),
        path.join(HOST_DATA, fileName),
    ]);

    return { ok: true, file: fileName };
}

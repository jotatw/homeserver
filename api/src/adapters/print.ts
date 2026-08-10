import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const RUNNER_IMAGE = "debian:bookworm-slim";
const CONTAINER_DATA = path.join("/workspace", "api", "data");
const HOST_DATA = "/srv/git/homeserver/api/data";

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB (arquivo decodificado)

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

export interface PrinterStatus {
    name: string;
    state: string; // idle | printing | disabled
    accepting: boolean;
    activeJobs: number;
    lastJob: string | null; // ISO timestamp do último trabalho concluído
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

function parseState(lines: string[]): Map<string, string> {
    const states = new Map<string, string>();

    for (const line of lines) {
        const m = line.match(/^printer (\S+) is (\w+)/);
        if (m) {
            states.set(m[1], m[2]);
        }
    }

    return states;
}

function parseAccepting(lines: string[]): Map<string, boolean> {
    const map = new Map<string, boolean>();

    for (const line of lines) {
        const m = line.match(/^(\S+) (accepting|not accepting) requests/);
        if (m) {
            map.set(m[1], m[2] === "accepting");
        }
    }

    return map;
}

function countJobsByPrinter(lines: string[]): Map<string, number> {
    const counts = new Map<string, number>();

    for (const line of lines) {
        const m = line.match(/^(\S+)-\d+\s/);
        if (m) {
            counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
        }
    }

    return counts;
}

function lastJobByPrinter(lines: string[]): Map<string, string> {
    const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const map = new Map<string, string>();

    for (const line of lines) {
        // Via nsenter (locale C): "MG3110-8  user  1024  Mon Aug 10 14:59:02 2026"
        const m = line.match(
            /^(\S+)-(\d+)\s+\S+\s+\S+\s+(\w{3}) (\w{3}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2}) (\d{4})/,
        );
        if (!m) {
            continue;
        }

        const name = m[1];
        const month = months[m[4]];
        const ts = new Date(+m[9], month, +m[5], +m[6], +m[7], +m[8]).getTime();

        // Mantém o primeiro encontrado (lpstat lista do mais recente para o
        // mais antigo) — sobrescrever traria o job mais antigo.
        if (!Number.isNaN(ts) && !map.has(name)) {
            map.set(name, new Date(ts).toISOString());
        }
    }

    return map;
}

export async function getPrintersInfo(): Promise<PrinterStatus[]> {
    // Um único docker run + nsenter executa todos os lpstat (reduz o overhead).
    const raw = await runOnHost([
        "bash", "-c",
        "echo '==P=='; lpstat -p; echo '==A=='; lpstat -a; " +
        "echo '==J=='; lpstat -o; echo '==C=='; lpstat -W completed -o",
    ]);

    const [p, a, jobs, completed] = raw.split(/==[PAJC]==/).slice(1).map((s) => s.trim());

    const states = parseState(p.split("\n"));
    const accepting = parseAccepting(a.split("\n"));
    const jobCounts = countJobsByPrinter(jobs.split("\n"));
    const lastJobs = lastJobByPrinter(completed.split("\n"));

    const names = new Set([
        ...states.keys(),
        ...accepting.keys(),
        ...jobCounts.keys(),
        ...lastJobs.keys(),
    ]);

    return [...names].sort().map((name) => ({
        name,
        state: states.get(name) ?? "unknown",
        accepting: accepting.get(name) ?? false,
        activeJobs: jobCounts.get(name) ?? 0,
        lastJob: lastJobs.get(name) ?? null,
    }));
}

export async function listPrinters(): Promise<string[]> {
    const info = await getPrintersInfo();
    return info.map((p) => p.name);
}

export async function printContent(
    content: PrintContent,
    opts: PrintOptions = {},
): Promise<{ ok: boolean; file?: string }> {
    await fs.mkdir(CONTAINER_DATA, { recursive: true });

    let fileName = "print-job.txt";

    if (content.file?.data) {
        const name = content.file.name || "print-job.pdf";
        const safe = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
        const data = Buffer.from(content.file.data, "base64");

        if (data.byteLength > MAX_FILE_BYTES) {
            throw new Error("Arquivo excede o limite de 20 MB.");
        }

        fileName = safe;
        await fs.writeFile(path.join(CONTAINER_DATA, fileName), data);
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

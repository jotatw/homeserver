import { promises as fs } from "node:fs";
import path from "node:path";
import {
    runHostPrintCancel,
    runHostPrintLp,
    runHostPrintLpstat,
} from "../utils/executor.js";

const CONTAINER_DATA = path.join("/workspace", "api", "data");
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export interface PrintOptions {
    printer?: string;
    color?: "color" | "mono";
    media?: string;
    pages?: string;
    orientation?: "portrait" | "landscape";
    quality?: "economico" | "normal" | "alta";
}

export interface PrintJob {
    id: string;
    printer: string;
    user: string;
    bytes: number;
    date: string | null;
    status: "printing" | "completed";
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
    state: string;
    accepting: boolean;
    activeJobs: number;
    lastJob: string | null;
}

function lpOptions(opts: PrintOptions): string[] {
    const args: string[] = [];

    if (opts.media) {
        args.push("-o", `media=${opts.media}`);
    }
    if (opts.color === "mono") {
        args.push("-o", "ColorModel=Gray");
    }
    if (opts.quality === "economico") {
        args.push("-o", "Resolution=300dpi");
    } else if (opts.quality === "alta") {
        args.push("-o", "Resolution=601x600dpi", "-o", "StpColorPrecision=Best");
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
        if (m) states.set(m[1], m[2]);
    }
    return states;
}

function parseAccepting(lines: string[]): Map<string, boolean> {
    const map = new Map<string, boolean>();
    for (const line of lines) {
        const m = line.match(/^(\S+) (accepting|not accepting) requests/);
        if (m) map.set(m[1], m[2] === "accepting");
    }
    return map;
}

function countJobsByPrinter(lines: string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const line of lines) {
        const m = line.match(/^(\S+)-\d+\s/);
        if (m) counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
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
        const m = line.match(
            /^(\S+)-(\d+)\s+\S+\s+\S+\s+(\w{3}) (\w{3}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2}) (\d{4})/,
        );
        if (!m) continue;

        const name = m[1];
        const month = months[m[4]];
        const ts = new Date(+m[9], month, +m[5], +m[6], +m[7], +m[8]).getTime();

        if (!Number.isNaN(ts) && !map.has(name)) {
            map.set(name, new Date(ts).toISOString());
        }
    }

    return map;
}

export async function getPrintersInfo(): Promise<PrinterStatus[]> {
    const raw = await runHostPrintLpstat("full");
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

const JOB_MONTHS: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseJobLine(line: string): PrintJob | null {
    const m = line.match(
        /^(\S+)-(\d+)\s+(\S+)\s+(\d+)\s+(\w{3}) (\w{3}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2}) (\d{4})/,
    );
    if (!m) return null;

    const month = JOB_MONTHS[m[6]];
    const ts = new Date(+m[11], month, +m[7], +m[8], +m[9], +m[10]).getTime();

    return {
        id: `${m[1]}-${m[2]}`,
        printer: m[1],
        user: m[3],
        bytes: Number(m[4]),
        date: Number.isNaN(ts) ? null : new Date(ts).toISOString(),
        status: "printing",
    };
}

export async function listJobs(): Promise<PrintJob[]> {
    const raw = await runHostPrintLpstat("active");
    const [active, completed] = raw.split(/==[AC]==/).slice(1).map((s) => s.trim());

    const jobs: PrintJob[] = [];

    for (const line of active.split("\n")) {
        const job = parseJobLine(line);
        if (job) jobs.push({ ...job, status: "printing" });
    }

    for (const line of completed.split("\n")) {
        const job = parseJobLine(line);
        if (job) jobs.push({ ...job, status: "completed" });
    }

    return jobs;
}

export async function cancelJob(jobId: string): Promise<{ ok: boolean }> {
    await runHostPrintCancel(jobId);
    return { ok: true };
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

    await runHostPrintLp(printer, lpOptions(opts), fileName);

    return { ok: true, file: fileName };
}
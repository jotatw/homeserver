import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

async function runCore(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
    return stdout.trim();
}

export async function getEvents() {
    const raw = await runCore(["system", "events"]);
    return JSON.parse(raw);
}

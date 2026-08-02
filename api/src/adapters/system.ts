import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const SYSTEM_SCRIPT = "/workspace/core/hs.sh";

export async function getHostname(): Promise<string> {
    const { stdout } = await execFileAsync(
        "/bin/bash",
        [SYSTEM_SCRIPT, "system", "hostname"]
    );

    return stdout.trim();
}

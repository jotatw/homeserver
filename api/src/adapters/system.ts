import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const SYSTEM_SCRIPT =
    "/workspace/core/domain/system/system.sh";

export async function getHostname(): Promise<string> {
    console.log("Script:", SYSTEM_SCRIPT);

    const { stdout } = await execFileAsync(
        "/bin/bash",
        [SYSTEM_SCRIPT, "hostname"]
    );

    return stdout.trim();
}


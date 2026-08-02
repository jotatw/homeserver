import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const RUNNER_IMAGE = "debian:bookworm-slim";

export async function triggerBackup(): Promise<{ ok: boolean }> {
    await execFileAsync(
        "docker",
        [
            "run", "--rm", "--privileged", "--pid", "host",
            RUNNER_IMAGE,
            "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
            "bash", "/srv/scripts/backup.sh",
        ],
        { timeout: 300000 },
    );

    return { ok: true };
}

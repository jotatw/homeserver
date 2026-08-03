import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";
const RUNNER_IMAGE = "debian:bookworm-slim";

export async function getPower() {
    const { stdout } = await execFileAsync("/bin/bash", [CORE, "power", "status"]);
    return JSON.parse(stdout.trim());
}

export async function setPower(shutdown: string, wake: string, enabled: boolean) {
    if (enabled) {
        await execFileAsync(
            "docker",
            [
                "run", "--rm", "--privileged", "--pid", "host",
                RUNNER_IMAGE,
                "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
                "bash", "/srv/git/homeserver/core/hs.sh",
                "power", "set", shutdown, wake,
            ],
            { timeout: 60000 },
        );
    } else {
        await execFileAsync(
            "docker",
            [
                "run", "--rm", "--privileged", "--pid", "host",
                RUNNER_IMAGE,
                "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
                "bash", "/srv/git/homeserver/core/hs.sh",
                "power", "disable",
            ],
            { timeout: 60000 },
        );
    }

    return getPower();
}

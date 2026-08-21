import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { runHostPower } from "../utils/executor.js";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

export async function getPower() {
    const { stdout } = await execFileAsync("/bin/bash", ["/workspace/core/hs.sh", "power", "status"]);
    return JSON.parse(stdout.trim());
}

export async function setPower(shutdown: string, wake: string, enabled: boolean) {
    if (enabled) {
        await runHostPower("set", shutdown, wake);
    } else {
        await runHostPower("disable");
    }
    return getPower();
}
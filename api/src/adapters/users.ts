import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

async function runCore(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
    return stdout.trim();
}

export interface UserCreateRequest {
    username: string;
    password?: string;
    email?: string;
    gitea?: boolean;
}

export async function createUser(data: UserCreateRequest) {
    const args = ["user", "create", data.username];

    if (data.password) args.push(`--password=${data.password}`);
    if (data.email) args.push(`--email=${data.email}`);
    if (data.gitea) args.push("--gitea");

    const raw = await runCore(args);
    return JSON.parse(raw);
}

export async function listUsers() {
    const raw = await runCore(["user", "list"]);
    return JSON.parse(raw);
}

export async function deleteUser(username: string, removeFolder: boolean) {
    const args = ["user", "rm", username];
    if (removeFolder) args.push("--remove-folder");
    await runCore(args);
    return { ok: true };
}

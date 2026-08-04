import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORE = "/workspace/core/hs.sh";

async function runCore(args: string[]): Promise<{ stdout: string; code: number }> {
    try {
        const { stdout } = await execFileAsync("/bin/bash", [CORE, ...args]);
        return { stdout: stdout.trim(), code: 0 };
    } catch (error) {
        const err = error as { stdout?: string; code?: number };
        return { stdout: (err.stdout ?? "").trim(), code: err.code ?? 1 };
    }
}

export interface AuthResult {
    ok: boolean;
    username?: string;
    message?: string;
}

export async function verifyCredentials(
    username: string,
    password: string
): Promise<AuthResult> {
    if (!username || !password) {
        return { ok: false, message: "Usuário ou senha inválidos." };
    }

    const { code } = await runCore(["user", "verify", username, password]);

    if (code === 0) {
        return { ok: true, username };
    }

    return { ok: false, message: "Usuário ou senha inválidos." };
}

export async function isAdmin(username: string): Promise<boolean> {
    const { code } = await runCore(["user", "is-admin", username]);

    return code === 0;
}

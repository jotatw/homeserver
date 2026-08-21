import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const RUNNER_IMAGE = "debian:bookworm-slim";
const CORE_ON_HOST = "/srv/git/homeserver/core/hs.sh";
const BACKUP_SCRIPT = "/srv/scripts/backup.sh";
const LP_STAT_COMPOSITE = [
    "echo '==P=='; lpstat -p;",
    "echo '==A=='; lpstat -a;",
    "echo '==J=='; lpstat -o;",
    "echo '==C=='; lpstat -W completed -o;",
].join(" ");
const LP_STAT_ACTIVE = [
    "echo '==A=='; lpstat -o;",
    "echo '==C=='; lpstat -W completed -o;",
].join(" ");

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const LABEL_RE = /^[a-zA-Z0-9_-]+$/;
const DEVICE_RE = /^[a-zA-Z0-9]+$/;
const PRINTER_RE = /^[a-zA-Z0-9_-]+$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const JOB_ID_RE = /^[a-zA-Z0-9_-]+-\d+$/;
const FILENAME_RE = /^[a-zA-Z0-9._-]+$/;
const DEVICE_TYPE_RE = /^(usb|sdcard|external|temporary)$/;
const MODULE_OP_RE = /^(start|stop|restart|enable|disable|update|status)$/;
const POWER_SUB_RE = /^(status|enable|disable|set)$/;
const UPDATE_OS_SUB_RE = /^(check|apply)$/;
const DEVICE_SUB_RE = /^(mount|unmount|eject)$/;
const MODULE_OP_LIST = ["start", "stop", "restart", "enable", "disable", "update", "status"];
const MODULE_INFO_SUBS = ["definitions", "instances", "info", "status", "op"] as const;
const DEVICE_SUBS = ["mount", "unmount", "eject"] as const;
const POWER_SUBS = ["status", "enable", "disable", "set"] as const;
const MODULE_SUBS = ["definitions", "instances", "info", "status", "op"] as const;
const UPDATE_OS_SUBS = ["check", "apply"] as const;
const DEVICE_SUBS_LIST = ["mount", "unmount", "eject"] as const;
const PRINTER_OPTS = {
    media: /^media=.+$/,
    color: /^ColorModel=.+$/,
    resolution: /^Resolution=.+$/,
    "stp-color-precision": /^StpColorPrecision=.+$/,
    "page-ranges": /^page-ranges=.+$/,
    orientation: /^orientation-requested=.+$/,
};

/**
 * Erro customizado para falhas de validação do executor.
 */
export class ExecutorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ExecutorError";
    }
}

/**
 * Sanitiza e valida argumentos para comandos `hs` (module, device, power, update).
 */
function validateHsArgs(args: string[]): void {
    if (args.length < 1) {
        throw new ExecutorError("Comando hs requer subcomando (device, module, power, update)");
    }

    const sub = args[0];

    if (sub === "device") {
        if (args.length < 2) throw new ExecutorError("device requer subcomando (mount, unmount, eject)");
        const subSub = args[1];
        if (!["mount", "unmount", "eject"].includes(subSub)) {
            throw new ExecutorError(`device subcomando inválido: ${subSub}. Use: mount, unmount, eject`);
        }
        if (subSub === "mount") {
            if (args.length !== 5) throw new ExecutorError("device mount requer: <type> <label> <device>");
            if (!/^(usb|sdcard|external|temporary)$/.test(args[2])) {
                throw new ExecutorError(`device type inválido: ${args[2]}. Use: usb, sdcard, external, temporary`);
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(args[3])) {
                throw new ExecutorError(`label inválido: ${args[3]}. Use apenas [a-zA-Z0-9_-]`);
            }
            if (!/^[a-zA-Z0-9]+$/.test(args[4])) {
                throw new ExecutorError(`device inválido: ${args[4]}. Use apenas letras e números (ex.: sdb1)`);
            }
        } else if (subSub === "unmount") {
            if (args.length !== 4) throw new ExecutorError("device unmount requer: <type> <label>");
            if (!/^(usb|sdcard|external|temporary)$/.test(args[2])) {
                throw new ExecutorError(`device type inválido: ${args[2]}. Use: usb, sdcard, external, temporary`);
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(args[3])) {
                throw new ExecutorError(`label inválido: ${args[3]}. Use apenas [a-zA-Z0-9_-]`);
            }
        } else if (subSub === "eject") {
            if (args.length !== 3) throw new ExecutorError("device eject requer: <device>");
            if (!/^[a-zA-Z0-9]+$/.test(args[2])) {
                throw new ExecutorError(`device inválido: ${args[2]}. Use apenas letras e números`);
            }
        }
    } else if (sub === "module") {
        if (args.length < 2) throw new ExecutorError("module requer subcomando (definitions, instances, info, status, op)");
        const subSub = args[1];
        if (!["definitions", "instances", "info", "status", "op"].includes(subSub)) {
            throw new ExecutorError(`module subcomando inválido: ${subSub}. Use: definitions, instances, info, status, op`);
        }
        if (subSub === "info" || subSub === "status") {
            if (args.length !== 3) throw new ExecutorError(`${subSub} requer: <id>`);
            if (!/^[a-z0-9][a-z0-9-]*$/.test(args[2])) {
                throw new ExecutorError(`module id inválido: ${args[2]}. Use slug [a-z0-9-]`);
            }
        } else if (subSub === "op") {
            if (args.length !== 4) throw new ExecutorError("module op requer: <id> <op>");
            if (!/^[a-z0-9][a-z0-9-]*$/.test(args[2])) {
                throw new ExecutorError(`module id inválido: ${args[2]}. Use slug [a-z0-9-]`);
            }
            if (!["start", "stop", "restart", "enable", "disable", "update", "status"].includes(args[3])) {
                throw new ExecutorError(`module op inválido: ${args[3]}. Use: start, stop, restart, enable, disable, update, status`);
            }
        } else if (subSub === "definitions" || subSub === "instances") {
            if (args.length !== 2) throw new ExecutorError(`${subSub} não aceita argumentos`);
        }
    } else if (sub === "power") {
        if (args.length < 2) throw new ExecutorError("power requer subcomando (status, enable, disable, set)");
        const subSub = args[1];
        if (!["status", "enable", "disable", "set"].includes(subSub)) {
            throw new ExecutorError(`power subcomando inválido: ${subSub}. Use: status, enable, disable, set`);
        }
        if (subSub === "set") {
            if (args.length !== 4) throw new ExecutorError("power set requer: <shutdown HH:MM> <wake HH:MM>");
            if (!/^\d{2}:\d{2}$/.test(args[2]) || !/^\d{2}:\d{2}$/.test(args[3])) {
                throw new ExecutorError("Formato de horário inválido. Use HH:MM (ex.: 23:30 07:00)");
            }
        } else if (subSub === "status" || subSub === "enable" || subSub === "disable") {
            if (args.length !== 2) throw new ExecutorError(`${subSub} não aceita argumentos`);
        }
    } else if (sub === "update") {
        if (args.length < 2) throw new ExecutorError("update requer subcomando (os)");
        if (args[1] !== "os") throw new ExecutorError("update subcomando inválido: use 'os'");
        if (args.length < 3) throw new ExecutorError("update os requer subcomando (check, apply)");
        if (!["check", "apply"].includes(args[2])) {
            throw new ExecutorError("update os subcomando inválido: use check ou apply");
        }
    } else {
        throw new ExecutorError(`Comando hs desconhecido: ${sub}. Use: device, module, power, update`);
    }
}

/**
 * Valida argumentos para comando `lp` de impressão.
 */
function validateLpArgs(args: string[]): void {
    if (args.length < 3 || args[0] !== "-d") {
        throw new ExecutorError("lp requer: -d <printer> [opções...] <arquivo>");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(args[1])) {
        throw new ExecutorError(`Printer inválido: ${args[1]}. Use apenas [a-zA-Z0-9_-]`);
    }
    // Opções -o devem seguir formato chave=valor com chaves permitidas
    const fileArg = args[args.length - 1];
    if (!/^\/srv\/git\/homeserver\/api\/data\/[a-zA-Z0-9._-]+$/.test(fileArg)) {
        throw new ExecutorError(`Arquivo inválido: ${fileArg}. Deve estar em /srv/git/homeserver/api/data/ com nome seguro`);
    }
    // Validar opções -o
    for (let i = 2; i < args.length - 1; i++) {
        if (args[i] !== "-o") {
            throw new ExecutorError(`Opção desconhecida: ${args[i]}. Apenas -o <chave=valor> permitido`);
        }
        const opt = args[i + 1];
        const keyVal = opt.split("=");
        if (keyVal.length !== 2 || !/^[a-zA-Z0-9_-]+$/.test(keyVal[0])) {
            throw new ExecutorError(`Opção -o inválida: ${opt}. Use chave=valor com [a-zA-Z0-9_-]`);
        }
        // Pular validação do valor (aceita qualquer string não-vazia)
        if (!keyVal[1]) {
            throw new ExecutorError(`Valor vazio para opção ${keyVal[0]}`);
        }
        i++; // pular o valor
    }
}

/**
 * Valida argumentos para comando `cancel` de job de impressão.
 */
function validateCancelArgs(args: string[]): void {
    if (args.length !== 1) {
        throw new ExecutorError("cancel requer exatamente 1 argumento: <jobId>");
    }
    if (!/^[a-zA-Z0-9_-]+-\d+$/.test(args[0])) {
        throw new ExecutorError(`jobId inválido: ${args[0]}. Formato esperado: <printer>-<número>`);
    }
}

/**
 * Valida argumentos para `lpstat` (somente scripts compostos permitidos).
 */
function validateLpstatArgs(args: string[]): void {
    // Permite apenas dois scripts compostos conhecidos
    const full = args.join(" ");
    if (full !== LP_STAT_COMPOSITE && full !== LP_STAT_ACTIVE) {
        throw new ExecutorError("lpstat: apenas scripts compostos conhecidos são permitidos");
    }
}

/**
 * Executa comando no host via nsenter.
 *
 * @param args Array de argumentos passados APÓS o nsenter (ex.: ["bash", "/srv/git/homeserver/core/hs.sh", "device", "mount", "usb", "LABEL", "sdb1"])
 * @param options Opções opcionais (timeout)
 * @returns stdout do comando
 */
export async function runOnHost(
    args: string[],
    options: { timeout?: number } = {}
): Promise<string> {
    if (args.length === 0) {
        throw new ExecutorError("runOnHost requer pelo menos um argumento");
    }

    const cmd = args[0];

    // ---- VALIDAÇÃO POR COMANDO ----
    if (cmd === "bash") {
        if (args.length < 2) throw new ExecutorError("bash requer script ou -c");
        const script = args[1];

        if (script === "/srv/scripts/backup.sh") {
            if (args.length !== 2) throw new ExecutorError("backup script não aceita argumentos adicionais");
        } else if (script === CORE_ON_HOST) {
            // hs.sh subcomandos: device, module, power, update
            if (args.length < 3) throw new ExecutorError("hs.sh requer subcomando");
            validateHsArgs(args.slice(2));
        } else if (script === "-c") {
            // Scripts compostos de lpstat (apenas os dois conhecidos)
            if (args.length < 3) throw new ExecutorError("bash -c requer script");
            const scriptContent = args.slice(2).join(" ");
            if (scriptContent !== LP_STAT_COMPOSITE && scriptContent !== LP_STAT_ACTIVE) {
                throw new ExecutorError("bash -c: apenas scripts lpstat compostos conhecidos são permitidos");
            }
        } else {
            throw new ExecutorError(`bash script não permitido: ${script}`);
        }
    } else if (cmd === "cancel") {
        if (args.length !== 2) throw new ExecutorError("cancel requer exatamente 1 argumento: <jobId>");
        if (!/^[a-zA-Z0-9_-]+-\d+$/.test(args[1])) {
            throw new ExecutorError(`jobId inválido: ${args[1]}. Formato: <printer>-<número>`);
        }
    } else if (cmd === "lp") {
        validateLpArgs(args.slice(1));
    } else if (cmd === "lpstat") {
        validateLpstatArgs(args.slice(1));
    } else if (cmd === "cancel") {
        // já tratado acima
    } else {
        throw new ExecutorError(`Comando não permitido: ${cmd}. Permitidos: bash, lp, lpstat, cancel`);
    }

    // ---- EXECUÇÃO NO HOST VIA NSENTER ----
    const dockerArgs = [
        "run", "--rm", "--privileged", "--pid", "host",
        "debian:bookworm-slim",
        "nsenter", "-t", "1", "-m", "-u", "-i", "-n", "--",
        ...args,
    ];

    const { stdout } = await execFileAsync("docker", dockerArgs, {
        timeout: options.timeout ?? 120000,
    });

    return stdout.trim();
}

/**
 * Helpers de alto nível para operações comuns (usados pelos adaptadores).
 */

export async function runHostBackup(): Promise<{ ok: boolean }> {
    await runOnHost(["bash", "/srv/scripts/backup.sh"], { timeout: 300000 });
    return { ok: true };
}

export async function runHostDevice(subcmd: "mount" | "unmount" | "eject", ...args: string[]): Promise<string> {
    if (subcmd === "mount") {
        if (arguments.length !== 4) throw new ExecutorError("device mount requer: <type> <label> <device>");
        return runOnHost(["bash", CORE_ON_HOST, "device", "mount", ...args]);
    }
    if (subcmd === "unmount") {
        if (arguments.length !== 3) throw new ExecutorError("device unmount requer <type> <label>");
        return runOnHost(["bash", CORE_ON_HOST, "device", "unmount", ...args]);
    }
    if (subcmd === "eject") {
        if (arguments.length !== 2) throw new ExecutorError("device eject requer <device>");
        return runOnHost(["bash", CORE_ON_HOST, "device", "eject", ...args]);
    }
    throw new ExecutorError(`device subcomando inválido: ${subcmd}`);
}

export async function runHostModule(subcmd: "definitions" | "instances" | "info" | "status" | "op", ...args: string[]): Promise<string> {
    if (subcmd === "definitions" || subcmd === "instances") {
        if (arguments.length !== 1) throw new ExecutorError(`${subcmd} não aceita argumentos`);
        return runOnHost(["bash", CORE_ON_HOST, "module", subcmd]);
    }
    if (subcmd === "info" || subcmd === "status") {
        if (arguments.length !== 2) throw new ExecutorError(`${subcmd} requer <id>`);
        return runOnHost(["bash", CORE_ON_HOST, "module", subcmd, ...args]);
    }
    if (subcmd === "op") {
        if (arguments.length !== 3) throw new ExecutorError("module op requer <id> <op>");
        return runOnHost(["bash", CORE_ON_HOST, "module", "op", ...args]);
    }
    throw new ExecutorError(`module subcomando inválido: ${subcmd}`);
}

export async function runHostPower(subcmd: "status" | "enable" | "disable" | "set", ...args: string[]): Promise<string> {
    if (subcmd === "status" || subcmd === "enable" || subcmd === "disable") {
        if (arguments.length !== 1) throw new ExecutorError(`${subcmd} não aceita argumentos`);
        return runOnHost(["bash", CORE_ON_HOST, "power", subcmd]);
    }
    if (subcmd === "set") {
        if (arguments.length !== 3) throw new ExecutorError("power set requer <shutdown HH:MM> <wake HH:MM>");
        return runOnHost(["bash", CORE_ON_HOST, "power", "set", ...args]);
    }
    throw new ExecutorError(`power subcomando inválido: ${subcmd}`);
}

export async function runHostUpdate(subcmd: "check" | "apply", ...args: string[]): Promise<string> {
    if (arguments.length !== 1) throw new ExecutorError("update os requer subcomando (check|apply)");
    return runOnHost(["bash", CORE_ON_HOST, "update", "os", subcmd]);
}

/**
 * Operações de impressão (print.ts).
 */
const LP_OPT_KEYS = ["media", "ColorModel", "Resolution", "StpColorPrecision", "page-ranges", "orientation-requested"] as const;

export async function runHostPrintLpstat(script: "full" | "active"): Promise<string> {
    const scriptStr = script === "full" ? LP_STAT_COMPOSITE : LP_STAT_ACTIVE;
    return runOnHost(["bash", "-c", scriptStr]);
}

export async function runHostPrintCancel(jobId: string): Promise<string> {
    return runOnHost(["cancel", jobId]);
}

export async function runHostPrintLp(
    printer: string,
    options: ReadonlyArray<string>,
    filename: string
): Promise<string> {
    return runOnHost(["lp", "-d", printer, ...options, `/srv/git/homeserver/api/data/${filename}`]);
}
import { runHostModule } from "../utils/executor.js";

export async function listModuleDefinitions(): Promise<unknown> {
    return JSON.parse(await runHostModule("definitions"));
}

export async function getModuleDefinition(id: string): Promise<unknown> {
    return JSON.parse(await runHostModule("info", id));
}

export async function listModuleInstances(): Promise<unknown> {
    return JSON.parse(await runHostModule("instances"));
}

export async function runModuleOp(id: string, op: string): Promise<unknown> {
    return JSON.parse(await runHostModule("op", id, op));
}
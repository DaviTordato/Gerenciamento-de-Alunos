// imports
import fs from "node:fs/promises";
import path from "node:path"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datepath = path.join(__dirname, "..", "BD", "tabela_alunos.json");

// list all - read the local archive
export async function listall() {
    const content = await fs.readFile(datepath, "utf-8");

    return JSON.parse(content)
}

// write/save
export async function saveall(Cadastrat) {
    await fs.writeFile(datepath, JSON.stringify(Cadastrat, null, 2),
        "utf-8"
    );
}
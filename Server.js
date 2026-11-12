import express, { json } from "express";
import { listall, saveall } from "./manager/manager.js";

const app = express();
const port = 3000;
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Bem-vindo a API de consulta de presensa de alunos!")
})

app.get("/alunos", async (req, res) => {
    try {
        const List = await listall();
        return res.status(200).json(List);
    }
    catch (error) {
        console.log(`Erro ao listar os alunos: ${error}`);
        res.status(500).json({ error: "Não foi possível ler a lista de alunos." })
    }
})

app.get("/Alunos/:id", async (req, res) => {
    try {
        const List = await listall();
        const id = Number(req.params.id)
        const aluno = List.find((alunoSelecionado) => (alunoSelecionado.id === id))
        return res.status(200).json(aluno);
    }
    catch (error) {
        console.log(`Erro ao listar os alunos: ${error}`);
        res.status(404).json({ error: "Não foi possível encontrar esse aluno." })
    }
})

app.post("/alunos", async (req, res) => {
    try {
        const { id, matricula, nome, turma, data, presente, motivoSaida, minutosFora } = req.body;        
        if (!id || !matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" })
        }
        const novoCadastro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: Date(data),
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: Boolean((tempo) => (minutosFora > 15))
        }
        const cadastros = await listall();
        cadastros.push(novoCadastro);
        await saveall(cadastros);

        return res.status(201).json({ mensagem: "Cadastro do aluno realizado com sucesso" })
    }
    catch (error) {
        console.log("Erro ao salvar cadastro do aluno", error)
        return res.status(500).json
            ({ error: "Não foi possível salvar cadastro do aluno" })
    }
})

app.put("/Alunos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const dados = await listall();

        const AlunoAchado = dados.find(
            (Aluno) => Aluno.id === id
        );
        if (!AlunoAchado) {
            return res.status(404).json({ error: "Aluno não encontrado" })
        }
        const { matricula, nome, turma, data, presente, motivoSaida, minutosFora } = req.body;        
        if (!id || !matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" })
        }
        const novoCadastro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: Date(data),
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: Boolean((tempo) => (minutosFora > 15))
        }

        const dadosAtualizados = dados.map((Aluno) =>
            Aluno.id === id ? novoCadastro : Aluno
        );
        await saveall(dadosAtualizados);

        return res.status(200).json({ mensagem: "Cadastro do aluno atualizado com sucesso" })

    }

    catch (error) {
        console.log("Erro ao alterar cadastro", error)
        return res.status(500).json
            ({ error: "Não foi possível alterar e salvar cadastro" })
    }
});


app.delete("/alunos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const list = await listall();
        const updated_list = list.filter((Aluno) => Aluno.id !== id)

        if (updated_list.length === list.length) {
            { return res.status(404).json({ error: "Não foi possível deletar esse atendimento." }) }
        }

        await saveall(updated_list)
        return res.status(200).json({ mensagem: "Atendimento excluído com sucesso." })
    }
    catch (error) {
        res.status(500).json({ error: "Não foi possível encontrar o seguinte atendimento." })
        console.log(error);

    }
});

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada." })
})

// auxiliary functions
app.listen(port, () => {
    console.log(`Run in port: ${port}`);
})


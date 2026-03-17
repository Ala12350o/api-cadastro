const express = require('express'); //servidor web
const fs = require('fs'); //manipulação de arquivos
const path = require('path'); //manipulação de caminhos

const app = express();
const port = 3000;

app.use(express.json());

/*
CLIENTES ENDPOINTS:
*/

const clientesFile = path.join(__dirname, "clientes.json");

function lerClientes() {
    if (!fs.existsSync(clientesFile)) {
        return [];
    }
    const dadosClientes = fs.readFileSync(clientesFile, 'utf-8');

    try {
        return JSON.parse(dadosClientes) || [];
    } catch (e) {
        return [];
    }

}

function salvarClientes(clientes) {
    fs.writeFileSync(clientesFile, JSON.stringify(clientes, null, 2), 'utf-8');
}

app.post('/clientes', (req, res) => {
    const {cpf, nome, idade, endereco, bairro, contato} = req.body;

    if (!cpf || !nome || !idade || !endereco || !bairro || !contato) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const clientes = lerClientes();
    
    if(clientes.some(c => c.cpf === cpf)) {
        return res.status(400).json({ error: 'CPF já cadastrado.' });
    }

const novoCliente = {cpf, nome, idade, endereco, bairro, contato};
clientes.push(novoCliente);
salvarClientes(clientes);

res.status(201).json({ message:'Cliente cadastrado com sucesso!', cliente: novoCliente });
});
  
app.get('/clientes', (req, res) => {
    const clientes = lerClientes();
    res.status(200).json(clientes);
});

app.get('/clientes/:cpf', (req, res) => {
    const { cpf } = req.params;
    const clientes = lerClientes();
    
    const cliente = clientes.find(c => c.cpf == cpf);
    
    if (!cliente) {
        return res.status(404).json({ error: 'esse cpf não está cadastrado' });
    }
    
    res.status(200).json(cliente);
});

const produtosFile = path.join(__dirname, "produtos.json");

function lerProdutos() {
    if (!fs.existsSync(produtosFile)) {
        return [];
    }
    const dadosProdutos = fs.readFileSync(produtosFile, 'utf-8');

    try {
        return JSON.parse(dadosProdutos) || [];
    } catch (e) {
        return [];
    }

}

function salvarProdutos(produtos) {
    fs.writeFileSync(produtosFile, JSON.stringify(produtos, null, 2), 'utf-8');
}

app.post('/produtos', (req, res) => {
    const {nome, id, valor, descricao} = req.body;

    if (!nome || !descricao || !valor || !id) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const produtos = lerProdutos();
    
    if(produtos.some(p => p.id === id && p.nome === nome)) {
        return res.status(400).json({ error: 'Produto com ID e nome igual já cadastrado.' });
    }

const novoProduto = {nome, descricao, valor, id};
produtos.push(novoProduto);
salvarProdutos(produtos);

res.status(201).json({ message:'Produto cadastrado com sucesso!', produto: novoProduto });
});

app.get('/produtos', (req, res) => {
    const produtos = lerProdutos();
    res.status(200).json(produtos);
});

app.get('/produtos/:id/:nome', (req, res) => {
    const { id, nome } = req.params;
    const produtos = lerProdutos();
    
    const produto = produtos.find(p => p.id == id && p.nome === nome);
    
    if (!produto) {
        return res.status(404).json({ error: 'nome ou id não cadastrado' });
    }
    
    res.status(200).json(produto);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
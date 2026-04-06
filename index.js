const express = require('express'); //servidor web
const fs = require('fs'); //manipulação de arquivos
const path = require('path'); //manipulação de caminhos
const cors = require('cors'); //manipulação de arquivos

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

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
        return []
    }

}

function salvarClientes(clientes) {
    fs.writeFileSync(clientesFile, JSON.stringify(clientes, null, 2), 'utf-8');
}

app.post('/clientes', (req, res) => {
    const { cpf, nome, idade, endereco, bairro, contato } = req.body;

    if (!cpf || !nome || !idade || !endereco || !bairro || !contato) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const clientes = lerClientes();

    if (clientes.some(c => c.cpf === cpf)) {
        return res.status(400).json({ error: 'CPF já cadastrado.' });
    }

    const novoCliente = { cpf, nome, idade, endereco, bairro, contato };
    clientes.push(novoCliente);
    salvarClientes(clientes);

    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente: novoCliente });
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
    const { nome, id, valor, descricao } = req.body;

    if (!nome || !descricao || !valor || !id) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const produtos = lerProdutos();

    if(produtos.some(p => p.id === id)) {
        return res.status(400).json({ error: 'ID já cadastrado.' });
    }

    const novoProduto = { nome, descricao, valor, id };
    produtos.push(novoProduto);
    salvarProdutos(produtos);

    res.status(201).json({ message: 'Produto cadastrado com sucesso!', produto: novoProduto });
});

app.get('/produtos', (req, res) => {
    const produtos = lerProdutos();
    res.status(200).json(produtos);
});

app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const produtos = lerProdutos();

    const produto = produtos.find(p => p.id == id);

    if (!produto) {
        return res.status(404).json({ error: 'ID não cadastrado' });
    }

    res.status(200).json(produto);
});



const usuariosFile = path.join(__dirname, "usuarios.json");

function lerUsuarios() {
    if (!fs.existsSync(usuariosFile)) {
        return [];
    }
    const dadosUsuarios = fs.readFileSync(usuariosFile, 'utf-8');

    try {
        return JSON.parse(dadosUsuarios) || [];
    } catch (e) {
        return [];
    }

}

function salvarUsuarios(usuarios) {
    fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2), 'utf-8');
}

app.post('/usuarios', (req, res) => {
    const { codigo, nome, email, senha } = req.body;

    if (!codigo || !nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const usuarios = lerUsuarios();

    if (usuarios.some(u => u.email === email || u.codigo === codigo)) {
        return res.status(400).json({ error: 'Email ou código já cadastrados.' });
    }

    const novoUsuario = { codigo, nome, email, senha };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    res.status(201).json({ message: 'Usuario cadastrado com sucesso!', usuario: novoUsuario });
});

app.get('/usuarios', (req, res) => {
    const usuarios = lerUsuarios();
    res.status(200).json(usuarios);
});

app.get('/usuarios/:email', (req, res) => {
    const { email } = req.params;
    const usuarios = lerUsuarios();

    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
        return res.status(404).json({ error: 'Email não cadastrado' });
    }

    res.status(200).json(usuario);
});
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuarios = lerUsuarios();

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso', usuario });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
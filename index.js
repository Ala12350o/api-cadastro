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
    const { cpf, nome, idade, endereco, bairro, contato, usuario_codigo } = req.body;

    if (!cpf || !nome || !idade || !endereco || !bairro || !contato || !usuario_codigo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios, incluindo usuario_codigo.' });
    }

    const clientes = lerClientes();

    if (clientes.some(c => c.cpf === cpf && c.usuario_codigo == usuario_codigo)) {
        return res.status(400).json({ error: 'CPF já cadastrado para este usuário.' });
    }

    const novoCliente = { cpf, nome, idade, endereco, bairro, contato, usuario_codigo };
    clientes.push(novoCliente);
    salvarClientes(clientes);

    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente: novoCliente });
});

app.get('/clientes', (req, res) => {
    const { usuario_codigo } = req.query;
    const clientes = lerClientes();
    
    if (usuario_codigo) {
        const clientesFiltrados = clientes.filter(c => c.usuario_codigo == usuario_codigo);
        res.status(200).json(clientesFiltrados);
    } else {
        res.status(200).json(clientes);
    }
});

app.get('/clientes/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { usuario_codigo } = req.query;
    const clientes = lerClientes();

    const cliente = clientes.find(c => c.cpf == cpf);

    if (!cliente) {
        return res.status(404).json({ error: 'esse cpf não está cadastrado' });
    }

    if (usuario_codigo && cliente.usuario_codigo != usuario_codigo) {
        return res.status(403).json({ error: 'Você não tem permissão para ver este cliente' });
    }

    res.status(200).json(cliente);
});

app.put('/clientes/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { nome, idade, endereco, bairro, contato, usuario_codigo } = req.body;
    const clientes = lerClientes();
    
    const clienteIndex = clientes.findIndex(c => c.cpf == cpf);
    
    if (clienteIndex === -1) {
        return res.status(404).json({ error: 'CPF não cadastrado' });
    }
    
    const cliente = clientes[clienteIndex];
    
    if (usuario_codigo && cliente.usuario_codigo != usuario_codigo) {
        return res.status(403).json({ error: 'Você não tem permissão para atualizar este cliente' });
    }
    
    const clienteAtualizado = {
        ...cliente,
        nome: nome || cliente.nome,
        idade: idade || cliente.idade,
        endereco: endereco || cliente.endereco,
        bairro: bairro || cliente.bairro,
        contato: contato || cliente.contato
    };
    
    clientes[clienteIndex] = clienteAtualizado;
    salvarClientes(clientes);
    
    res.status(200).json({ message: 'Cliente atualizado com sucesso!', cliente: clienteAtualizado });
});

app.delete('/clientes/:cpf', (req, res) => {
    const { cpf } = req.params;
    const { usuario_codigo } = req.query;
    const clientes = lerClientes();
    
    const clienteIndex = clientes.findIndex(c => c.cpf == cpf);
    
    if (clienteIndex === -1) {
        return res.status(404).json({ error: 'esse cpf não está cadastrado' });
    }
    
    const cliente = clientes[clienteIndex];
    
    if (usuario_codigo && cliente.usuario_codigo != usuario_codigo) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar este cliente' });
    }
    
    const clienteRemovido = clientes.splice(clienteIndex, 1)[0];
    salvarClientes(clientes);
    
    res.status(200).json({ message: 'Cliente removido com sucesso!', cliente: clienteRemovido });
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
    const { nome, id, valor, descricao, usuario_codigo } = req.body;

    if (!nome || !descricao || !valor || !id || !usuario_codigo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios, incluindo usuario_codigo.' });
    }

    const produtos = lerProdutos();

    if(produtos.some(p => p.id === id && p.usuario_codigo == usuario_codigo)) {
        return res.status(400).json({ error: 'ID já cadastrado para este usuário.' });
    }

    const novoProduto = { nome, descricao, valor, id, usuario_codigo };
    produtos.push(novoProduto);
    salvarProdutos(produtos);

    res.status(201).json({ message: 'Produto cadastrado com sucesso!', produto: novoProduto });
});

app.get('/produtos', (req, res) => {
    const { usuario_codigo } = req.query;
    const produtos = lerProdutos();
    
    if (usuario_codigo) {
        const produtosFiltrados = produtos.filter(p => p.usuario_codigo == usuario_codigo);
        res.status(200).json(produtosFiltrados);
    } else {
        res.status(200).json(produtos);
    }
});

app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { usuario_codigo } = req.query;
    const produtos = lerProdutos();

    const produto = produtos.find(p => p.id == id);

    if (!produto) {
        return res.status(404).json({ error: 'ID não cadastrado' });
    }

    if (usuario_codigo && produto.usuario_codigo != usuario_codigo) {
        return res.status(403).json({ error: 'Você não tem permissão para ver este produto' });
    }

    res.status(200).json(produto);
});

app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, valor, descricao, usuario_codigo } = req.body;
    const produtos = lerProdutos();
    
    const produtoIndex = produtos.findIndex(p => p.id == id);
    
    if (produtoIndex === -1) {
        return res.status(404).json({ error: 'ID não cadastrado' });
    }
    
    const produto = produtos[produtoIndex];
    
    if (usuario_codigo && produto.usuario_codigo != usuario_codigo) {
        return res.status(403).json({ error: 'Você não tem permissão para atualizar este produto' });
    }
    
    const produtoAtualizado = {
        ...produto,
        nome: nome || produto.nome,
        valor: valor || produto.valor,
        descricao: descricao || produto.descricao
    };
    
    produtos[produtoIndex] = produtoAtualizado;
    salvarProdutos(produtos);
    
    res.status(200).json({ message: 'Produto atualizado com sucesso!', produto: produtoAtualizado });
});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { usuario_codigo } = req.query;
    const produtos = lerProdutos();
    
    const produtoIndex = produtos.findIndex(p => p.id == id);
    
    if (produtoIndex === -1) {
        return res.status(404).json({ error: 'ID não cadastrado' });
    }
    
    const produto = produtos[produtoIndex];
    
    if (usuario_codigo && produto.usuario_codigo != usuario_codigo) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar este produto' });
    }
    
    const produtoRemovido = produtos.splice(produtoIndex, 1)[0];
    salvarProdutos(produtos);
    
    res.status(200).json({ message: 'Produto removido com sucesso!', produto: produtoRemovido });
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
const express = require('express');
const router = express.Router();
const {dbClientes} = require('../../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken
const path = require('path');
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação

// Rota para criar um novo usuário (POST /api/usuarios)
router.post('/', async (req, res) => {
    const { nome, email, telefone, usuario, senha } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !usuario || !senha) {
        return res.status(400).json({ error: 'Nome, email, usuário e senha são obrigatórios.' });
    }

    try {
        // Verifica se o email já existe
        const [emailExists] = await dbClientes.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (emailExists.length > 0) {
            return res.status(400).json({ error: 'Este email já está cadastrado.' });
        }

        // Verifica se o usuário já existe
        const [usuarioExists] = await dbClientes.promise().query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        if (usuarioExists.length > 0) {
            return res.status(400).json({ error: 'Este usuário já está cadastrado.' });
        }

        // Gera o token JWT para confirmação de email (usando JWT_SECRET_MAIL)
        const token = jwt.sign({ id: email }, process.env.JWT_SECRET_MAIL, { expiresIn: '30d' }); //

        // Gera o hash da senha
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        // Insere o novo usuário no banco de dados
        const sql = 'INSERT INTO usuarios (nome, email, telefone, usuario, senha, saldoReais, saldoDolares, token_confirmacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await dbClientes.promise().query(sql, [nome, email, telefone, usuario, senhaHash, 0, 0, token]);

        res.json({ message: 'Usuário criado com sucesso!', token: token });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
});

// Rota para confirmar o email (GET /api/usuarios/confirmar-email)
router.get('/confirmar-email', async (req, res) => {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_MAIL);
        const email = decoded.id;
        const sql = 'UPDATE usuarios SET email_verificado = TRUE, token_confirmacao = ? WHERE email = ?';
        const mensagemLog = 'Email verificado ' + new Date().toISOString();
        await dbClientes.promise().query(sql, [mensagemLog, email]);

        //res.json({ message: 'Email confirmado com sucesso!' });
        res.sendFile(path.join(__dirname, '../../public/cliente/html/confirmacao_email.html'));
    } catch (error) {
        console.error('Erro ao confirmar email:', error);
        res.status(500).json({ error: 'Erro ao confirmar email.' });
    }
})

// Rota para criar um novo endereço (POST /api/usuarios/:id/enderecos)
router.post('/enderecos', autenticarClientes, async (req, res) => {
    const usuarioId = req.usuario.id;//Modelo de como resgatar o código do usuário pelo lado do servidor apenas pelo acessToken
    const { nomeEndereco, cep, endereco, numero, bairro, cidade, estado, complemento } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!cep || !endereco || !bairro || !cidade || !estado) {
        return res.status(400).json({ error: 'CEP, endereço, bairro, cidade e estado são obrigatórios.' });
    }

    try {
        // Insere o novo endereço no banco de dados
        const sql = 'INSERT INTO enderecos (usuario_id, apelido, cep, endereco, numero, bairro, cidade, estado, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await dbClientes.promise().query(sql, [usuarioId, nomeEndereco, cep, endereco, numero, bairro, cidade, estado, complemento]);

        res.json({ message: 'Endereço criado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro ao criar endereço:', error);
        res.status(500).json({ error: 'Erro ao criar endereço.' });
    }
});


// Rota para obter os dados do usuário e seus endereços (GET /api/usuarios/me)
router.get('/me', autenticarClientes, async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        // Busca os dados do usuário
        const [usuario] = await dbClientes.promise().query('SELECT nome, email, telefone, sobrenome, cpf FROM usuarios WHERE id = ?', [usuarioId]);

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Busca os endereços do usuário
        const [enderecos] = await dbClientes.promise().query('SELECT * FROM enderecos WHERE usuario_id = ?', [usuarioId]);

        // Adiciona os endereços ao objeto do usuário
        usuario[0].enderecos = enderecos;

        res.json(usuario[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// Rota para atualizar os dados do usuário (PUT /api/usuarios/me)
router.put('/me', autenticarClientes, async (req, res) => {
    const usuarioId = req.usuario.id;
    const { nome, telefone, sobrenome, cpf } = req.body;
    //console.log('id:',usuarioId,';','nome:',nome,';','telefone:',telefone,';','sobrenome:',sobrenome,';','cpf:',cpf);

    try {
        const sql = 'UPDATE usuarios SET nome = ?, telefone = ?, sobrenome = ?, cpf = ? WHERE id = ?';
        await dbClientes.promise().query(sql, [nome, telefone, sobrenome, cpf, usuarioId]);

        res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

// Rota para enviar email de redefinição de senha do usuário
router.post('/redefinir-senha', async (req, res) => {
    const { email } = req.body;

    try {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const [result] = await dbClientes.promise().query(sql, [email]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuário nao encontrado.' });
        }

        const { id } = result[0];

        // Gera o token JWT para redefinição de senha (usando JWT_SECRET_MAIL)
        const token = jwt.sign({ id }, process.env.JWT_SECRET_MAIL, { expiresIn: '1h' });

        // Atualiza o token de redefinição de senha no banco de dados
        const sqlUpdate = 'UPDATE usuarios SET token_confirmacao = ? WHERE id = ?';
        await dbClientes.promise().query(sqlUpdate, [token, id]);

        // Envia o email com o link de redefinição de senha
        const linkRedefinirSenha = `http://espiritodonativo.com.br/api/usuarios/redefinir-senha/${token}`;
        // Envia o email com o link de redefinição de senha
        //await enviarEmailRedefinirSenha(email, linkRedefinirSenha);

        res.json({ message: 'Email de redefinição de senha enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email de redefinição de senha:', error);
        res.status(500).json({ error: 'Erro ao enviar email de redefinição de senha.' });
    }
});

// Rota para redefinir a senha ( https://espiritodonativo.com.br/api/usuarios/mudar-senha/?token=${token})
router.post('/mudar-senha/:token', async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;

    if (!senha) {
        return res.status(400).json({ error: 'Senha é obrigatória.' });
    }
    if (senha.length < 8) {
        return res.status(400).json({ error: 'Senha precisa ter no mínimo 8 caracteres.' });
    }

    try {
        const sql = 'SELECT * FROM usuarios WHERE token_confirmacao = ?';
        const [result] = await dbClientes.promise().query(sql, [token]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuário nao encontrado.' });
        }

        const { id } = result[0];

        // Atualiza a senha no banco de dados
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        const sqlUpdate = 'UPDATE usuarios SET senha = ?, token_confirmacao = ? WHERE id = ?';
        const mensagemLog = 'Senha recuperada em ' + new Date().toISOString();
        await dbClientes.promise().query(sqlUpdate, [senhaHash, mensagemLog, id]);

        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ error: 'Erro ao redefinir senha.' });
    }
});


module.exports = router;
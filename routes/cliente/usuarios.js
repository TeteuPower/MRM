const express = require('express');
const router = express.Router();
const {dbClientes} = require('../../db')
const bcrypt = require('bcrypt');

// Rota para criar um novo usuário (POST /api/usuarios)
router.post('/', async (req, res) => {
    const { nome, email, telefone, endereco, usuario, senha } = req.body;

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

        // Gera o hash da senha
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        // Insere o novo usuário no banco de dados
        const sql = 'INSERT INTO usuarios (nome, email, telefone, endereco, usuario, senha, saldoReais, saldoDolares) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await dbClientes.promise().query(sql, [nome, email, telefone, endereco, usuario, senhaHash, 0, 0]);

        res.json({ message: 'Usuário criado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
});

module.exports = router;
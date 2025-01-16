const express = require('express');
const router = express.Router();
const { db } = require('../../db'); // Importa a conexão com o banco de dados
const autenticar = require('../../middleware/auth'); // Importa o middleware de autenticação
const bcrypt = require('bcrypt'); // Importa o módulo bcrypt

// API para obter um administrador por ID
router.get('/:id', autenticar, (req, res) => {
    const adminId = req.params.id;
    const sql = 'SELECT * FROM administradores WHERE id = ?';
    db.query(sql, [adminId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar administrador:', err);
            res.status(500).json({ error: 'Erro ao buscar administrador.' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Administrador não encontrado.' });
        }
    });
});

// Rota para atualizar o usuário do administrador (PUT /api/administradores/:id/usuario)
router.put('/:id/usuario', autenticar, async (req, res) => {
    const adminId = req.params.id;
    const { novoUsuario } = req.body;

    // Verifica se o novo usuário foi fornecido
    if (!novoUsuario) {
        return res.status(400).json({ error: 'O novo usuário é obrigatório.' });
    }

    try {
        // Busca o administrador no banco de dados
        const sql = 'SELECT * FROM administradores WHERE id = ?';
        const [results] = await db.promise().query(sql, [adminId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Administrador não encontrado.' });
        }

        // Verifica se o novo usuário já existe
        const sqlCheckUsuario = 'SELECT * FROM administradores WHERE usuario = ?';
        const [resultsUsuario] = await db.promise().query(sqlCheckUsuario, [novoUsuario]);
        if (resultsUsuario.length > 0) {
            return res.status(400).json({ error: 'O novo usuário já está em uso.' });
        }

        // Atualiza o usuário do administrador no banco de dados
        const sqlUpdate = 'UPDATE administradores SET usuario = ? WHERE id = ?';
        await db.promise().query(sqlUpdate, [novoUsuario, adminId]);

        res.json({ message: 'Usuário do administrador atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao alterar usuário do administrador:', error);
        res.status(500).json({ error: 'Erro ao alterar usuário do administrador.' });
    }
});

// Rota para atualizar a senha do administrador (PUT /api/administradores/:id/senha)
router.put('/:id/senha', autenticar, async (req, res) => {
    const adminId = req.params.id;
    const { senhaAtual, novaSenha } = req.body;

    // Verifica se a senha atual e a nova senha foram fornecidas
    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ error: 'A senha atual e a nova senha são obrigatórias.' });
    }

    try {
        // Busca o administrador no banco de dados
        const sql = 'SELECT * FROM administradores WHERE id = ?';
        const [results] = await db.promise().query(sql, [adminId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Administrador não encontrado.' });
        }

        const administrador = results[0];

        // Verifica se a senha atual está correta
        const senhaCorreta = await bcrypt.compare(senhaAtual, administrador.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Senha atual incorreta.' });
        }

        // Gera o hash da nova senha
        const saltRounds = 10;
        const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

        // Atualiza a senha do administrador no banco de dados
        const sqlUpdate = 'UPDATE administradores SET senha = ? WHERE id = ?';
        await db.promise().query(sqlUpdate, [novaSenhaHash, adminId]);

        res.json({ message: 'Senha do administrador atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao alterar senha do administrador:', error);
        res.status(500).json({ error: 'Erro ao alterar senha do administrador.' });
    }
});

// Rota para redefinir a senha de um administrador (PUT /api/administradores/:id/redefinir-senha)
router.put('/:id/redefinir-senha', autenticar, async (req, res) => {
    const adminId = req.params.id;
    const { novaSenha } = req.body;

    // Verifica se a nova senha foi fornecida
    if (!novaSenha) {
        return res.status(400).json({ error: 'A nova senha é obrigatória.' });
    }

    try {
        // Verifica se o administrador com o ID existe
        const sql = 'SELECT * FROM administradores WHERE id = ?';
        const [results] = await db.promise().query(sql, [adminId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Administrador não encontrado.' });
        }

        // Gera o hash da nova senha
        const saltRounds = 10;
        const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

        // Atualiza a senha do administrador no banco de dados
        const sqlUpdate = 'UPDATE administradores SET senha = ? WHERE id = ?';
        await db.promise().query(sqlUpdate, [novaSenhaHash, adminId]);

        res.json({ message: 'Senha do administrador redefinida com sucesso!' });
    } catch (error) {
        console.error('Erro ao redefinir senha do administrador:', error);
        res.status(500).json({ error: 'Erro ao redefinir senha do administrador.' });
    }
});

module.exports = router; // Exporta o roteador
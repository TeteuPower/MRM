const express = require('express');
const router = express.Router();
const { db } = require('../db');
const autenticar = require('../middleware/auth');
const bcrypt = require('bcrypt'); // Importa o módulo bcrypt

// Rota para criar um novo cliente (POST /api/clientes)
router.post('/', autenticar, async (req, res) => { // Adiciona async aqui
    const { nome, email, telefone, endereco, login, senha, saldoReais, saldoDolares } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !telefone || !endereco || !login || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Gera o hash da senha
        const saltRounds = 10; // Número de rounds para o bcrypt
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const sql = 'INSERT INTO clientes (nome, email, telefone, endereco, login, senha, saldoReais, saldoDolares) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [nome, email, telefone, endereco, login, senhaHash, saldoReais, saldoDolares], (err, result) => {
            if (err) {
                console.error('Erro ao criar cliente:', err);
                res.status(500).json({ error: 'Erro ao criar cliente.' });
                return;
            }
            res.json({ message: 'Cliente criado com sucesso!', id: result.insertId });
        });
    } catch (error) {
        console.error('Erro ao gerar hash da senha:', error);
        res.status(500).json({ error: 'Erro ao criar cliente.' });
    }
});

// Rota para obter todos os clientes (GET /api/clientes)
router.get('/', autenticar, (req, res) => {
    const sql = 'SELECT * FROM clientes';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            res.status(500).json({ error: 'Erro ao buscar clientes.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter um cliente por ID (GET /api/clientes/:id)
router.get('/:id', autenticar, (req, res) => {
    const clienteId = req.params.id;
    const sql = 'SELECT * FROM clientes WHERE id = ?';
    db.query(sql, [clienteId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            res.status(500).json({ error: 'Erro ao buscar cliente.' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado.' });
        }
    });
});

// Rota para atualizar um cliente (PUT /api/clientes/:id)
router.put('/:id', autenticar, (req, res) => {
    const clienteId = req.params.id;
    const { nome, email, telefone, endereco, login, senha } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    /*if (!nome || !email || !telefone || !endereco || !login || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }*/

    const sql = 'UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ?, login = ?, senha = ? WHERE id = ?';
    db.query(sql, [nome, email, telefone, endereco, login, senha, clienteId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar cliente:', err);
            res.status(500).json({ error: 'Erro ao atualizar cliente.' });
            return;
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'Cliente atualizado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Cliente não encontrado.' });
        }
    });
});

// Rota para excluir um cliente (DELETE /api/clientes/:id)
router.delete('/:id', autenticar, (req, res) => {
    const clienteId = req.params.id;
    const sql = 'DELETE FROM clientes WHERE id = ?';
    db.query(sql, [clienteId], (err, result) => {
        if (err) {
            console.error('Erro ao excluir cliente:', err);
            res.status(500).json({ error: 'Erro ao excluir cliente.' });
            return;
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'Cliente excluído com sucesso!' });
        } else {
            res.status(404).json({ error: 'Cliente não encontrado.' });
        }
    });
});

module.exports = router;
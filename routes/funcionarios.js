const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para criar um novo vendedor (POST /api/vendedores)
router.post('/', autenticar, (req, res) => {
    const { nome } = req.body;

    // Verifica se o nome do vendedor foi fornecido
    if (!nome) {
        return res.status(400).json({ error: 'O nome do vendedor é obrigatório.' });
    }

    const sql = 'INSERT INTO vendedores (nome) VALUES (?)';
    db.query(sql, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao criar vendedor:', err);
            res.status(500).json({ error: 'Erro ao criar vendedor.' });
            return;
        }
        res.json({ message: 'Vendedor criado com sucesso!', id: result.insertId });
    });
});

// Rota para obter todos os funcionários (GET /api/funcionarios)
router.get('/', autenticar, (req, res) => {
    const sql = 'SELECT * FROM vendedores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar funcionários:', err);
            res.status(500).json({ error: 'Erro ao buscar funcionários.' });
            return;
        }
        res.json(results);
    });
});

// Rota para criar um novo produtor (POST /api/produtores)
router.post('/produtores', autenticar, (req, res) => {
    const { nome } = req.body;

    // Verifica se o nome do produtor foi fornecido
    if (!nome) {
        return res.status(400).json({ error: 'O nome do produtor é obrigatório.' });
    }

    const sql = 'INSERT INTO produtores (nome) VALUES (?)';
    db.query(sql, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao criar produtor:', err);
            res.status(500).json({ error: 'Erro ao criar produtor.' });
            return;
        }
        res.json({ message: 'Produtor criado com sucesso!', id: result.insertId });
    });
});

// Rota para obter todos os funcionários (GET /api/funcionarios)
router.get('/produtores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM produtores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtor:', err);
            res.status(500).json({ error: 'Erro ao buscar produtor.' });
            return;
        }
        res.json(results);
    });
});


module.exports = router;
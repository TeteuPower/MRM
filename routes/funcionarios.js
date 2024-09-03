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

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para registrar um novo gasto (POST /api/gastos)
router.post('/', autenticar, (req, res) => {
    const { descricao, valor, moeda, administradorId } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!descricao || !valor || !moeda || !administradorId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'INSERT INTO gastos (descricao, valor, moeda, administrador_id, data) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [descricao, valor, moeda, administradorId, new Date()], (err, result) => {
        if (err) {
            console.error('Erro ao registrar gasto:', err);
            res.status(500).json({ error: 'Erro ao registrar gasto.' });
            return;
        }
        res.json({ message: 'Gasto registrado com sucesso!', id: result.insertId });
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter os pedidos aguardando produção (GET /api/pedidos/aguardando-producao)
router.get('/', autenticar, (req, res) => {
    const sql = 'SELECT * FROM pedidos WHERE status IN ("Em produção")';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos aguardando produção:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos aguardando produção.' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
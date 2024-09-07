const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter os pedidos finalizados (GET /api/pedidos/aguardando-producao)
router.get('/', autenticar, (req, res) => {
    const sql = 'SELECT * FROM pedidos WHERE status IN ("Finalizado")';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos finalizados:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos finalizados:' });
            return;
        }
        res.json(results);
    });
});
module.exports = router;
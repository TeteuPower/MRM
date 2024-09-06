const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter os pedidos finalizados aguardando envio (GET /api/pedidos/finalizados-aguardando-envio)
router.get('/', autenticar, (req, res) => {
    const sql = 'SELECT * FROM pedidos WHERE status IN ("Pronto, aguardando envio")';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos finalizados aguardando envio:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos finalizados aguardando envio.' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
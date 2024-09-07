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

// Rota para atualizar um pedido (PUT /api/pedidos/:id)
router.put('/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const { status, dataFinalizacao, valorFrete} = req.body;

    // Verifica se o status foi fornecido
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório.' });
    }

    // Atualiza o pedido no banco de dados
    const sql = 'UPDATE pedidos SET status = ?, data_finalizacao = ?, valor_frete = ? WHERE id = ?';
    db.query(sql, [status, dataFinalizacao, valorFrete, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
            return;
        }
    });
});

module.exports = router;
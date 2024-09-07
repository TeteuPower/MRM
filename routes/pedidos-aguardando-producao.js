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

// Rota para atualizar um pedido (PUT /api/pedidos/:id)
router.put('/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const { status, dataProducao, produtor, itens} = req.body;

    // Verifica se o status foi fornecido
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório.' });
    }

    // Atualiza o pedido no banco de dados
    const sql = 'UPDATE pedidos SET status = ?, produtor_id = ?, data_producao = ? WHERE id = ?';
    db.query(sql, [status, produtor, dataProducao, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
            return;
        }

        if (result.affectedRows > 0) {
            // Atualiza os itens do pedido
            itens.forEach(item =>
            {
                const sqlItem = 'UPDATE itens_pedido SET lote = ? WHERE pedido_id = ? AND produto_id = ? AND id = ?';
                db.query(sqlItem, [item.lote, pedidoId, item.produto_id, item.id], (err, result) =>
                {
                    if (err)
                    {
                        console.error('Erro ao atualizar item do pedido:', err);
                        res.status(500).json({ error: 'Erro ao atualizar pedido.' });
                        return;
                    }
                })
            })
            res.json({ message: 'Pedido atualizado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Pedido não encontrado.' });
        }
    });
});

module.exports = router;
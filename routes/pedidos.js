const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para atualizar um pedido (PUT /api/pedidos/:id)
router.put('/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const { status, dataFinalizacao, valorFrete, produtor, repasseComissao, saldoVenda, itens } = req.body;

    // Verifica se o status foi fornecido
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório.' });
    }

    // Atualiza o pedido no banco de dados
    const sql = 'UPDATE pedidos SET status = ?, dataFinalizacao = ?, valorFrete = ?, produtor_id = ?, repasseComissao = ?, saldoVenda = ? WHERE id = ?';
    db.query(sql, [status, dataFinalizacao, valorFrete, produtor, repasseComissao === true ? 1 : 0, saldoVenda, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Pedido atualizado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Pedido não encontrado.' });
        }
    });
});

// Rota para criar um novo pedido (POST /api/pedidos)
router.post('/', autenticar, (req, res) => {
    const { clienteId, dataCriacao, descricao, moeda, valorVenda, valorPago, status, administradorId, vendedorId, saldoVenda, itens} = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!clienteId || !dataCriacao || !moeda || !valorVenda || !valorPago || !administradorId || !vendedorId || !saldoVenda|| !itens) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Insere o pedido no banco de dados
    const sql = 'INSERT INTO pedidos (cliente_id, data_criacao, descricao, moeda, status, valor_venda, valor_pago, administrador_id, vendedor_id, saldo_venda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [clienteId, dataCriacao, descricao, moeda, status, valorVenda, valorPago, administradorId, vendedorId, saldoVenda], (err, result) => {
        if (err) {
            console.error('Erro ao criar pedido:', err);
            res.status(500).json({ error: 'Erro ao criar pedido.' });
            return;
        }

        const pedidoId = result.insertId;

        // Insere os itens do pedido
        itens.forEach(item => {
            const sqlItem = 'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, lote) VALUES (?, ?, ?, ?)';
            db.query(sqlItem, [pedidoId, item.produtoId, item.quantidade, item.lote], (err, result) => {
                if (err) {
                    console.error('Erro ao inserir item do pedido:', err);
                    res.status(500).json({ error: 'Erro ao criar pedido.' });
                    return;
                }
            });
        });

        res.json({ message: 'Pedido criado com sucesso!', id: pedidoId });
    });
});

// Rota para obter os pedidos de um cliente (GET /api/pedidos/cliente/:id)
router.get('/cliente/:id', autenticar, (req, res) => {
    const clienteId = req.params.id;
    const sql = 'SELECT * FROM pedidos WHERE cliente_id = ?';
    db.query(sql, [clienteId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos do cliente:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos do cliente.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os pedidos de um vendedor (GET /api/pedidos/vendedor/:id)
router.get('/vendedor/:id', autenticar, (req, res) => {
    const vendedorId = req.params.id;
    const sql = 'SELECT * FROM pedidos WHERE vendedor_id = ?';
    db.query(sql, [vendedorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos do vendedor:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos do vendedor.' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
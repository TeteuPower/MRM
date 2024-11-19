const express = require('express');
const router = express.Router();
const { db } = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter todos os clientes (GET /api/pagamentos/clientes)
router.get('/clientes', autenticar, (req, res) => {
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

// Rota para obter todos os vendedores (GET /api/pagamentos/vendedores)
router.get('/vendedores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM vendedores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendedores:', err);
            res.status(500).json({ error: 'Erro ao buscar vendedores.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter todos os Administradores (GET /api/pagamentos/vendedores)
router.get('/administradores', autenticar, (req, res) => {
    const sql = 'SELECT id, nome FROM administradores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendedores:', err);
            res.status(500).json({ error: 'Erro ao buscar vendedores.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os pedidos de um cliente (GET /api/pagamentos/pedidos/:clienteId)
router.get('/pedidos/:clienteId', autenticar, (req, res) => {
    const clienteId = req.params.clienteId;
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

// Rota para registrar um novo pagamento (POST /api/pagamentos)
router.post('/', autenticar, (req, res) => {
    const { clienteId, pedidoId, valor, moeda, vendedorId } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!clienteId || !valor || !moeda || !vendedorId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'INSERT INTO pagamentos (cliente_id, administrador_id, pedido_id, data, valor, moeda, vendedor_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [clienteId, req.usuario.id, pedidoId, new Date(), valor, moeda, vendedorId], (err, result) => {
        if (err) {
            console.error('Erro ao registrar pagamento:', err);
            res.status(500).json({ error: 'Erro ao registrar pagamento.' });
            return;
        }
        res.json({ message: 'Pagamento registrado com sucesso!', id: result.insertId });
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter os repasses pendentes para produção (GET /api/divisao-lucros/repasses-producao)
router.get('/repasses-producao', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id AS pedido_id,
            p.valor_venda,
            p.moeda,
            p.produtor_id,
            pr.nome AS produtor_nome
        FROM pedidos p
        JOIN produtores pr ON p.produtor_id = pr.id
        WHERE p.repasse_comissao = 0;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses pendentes para produção:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses pendentes para produção.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os repasses pendentes entre administradores (GET /api/divisao-lucros/repasses-administradores)
router.get('/repasses-administradores', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id AS pedido_id,
            p.valor_venda,
            p.moeda,
            a.id AS administrador_id,
            a.nome AS administrador_nome
        FROM pedidos p
        JOIN administradores a ON p.administrador_id = a.id
        WHERE p.repasse_comissao = 0;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses pendentes entre administradores:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses pendentes entre administradores.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os últimos repasses feitos (GET /api/divisao-lucros/repasses-feitos)
router.get('/repasses-feitos', autenticar, (req, res) => {
    const sql = `
        SELECT 
            r.id AS repasse_id,
            r.pedido_id,
            r.valor,
            r.moeda,
            r.data,
            a.nome AS destinatario_nome,
            v.nome AS vendedor_nome
        FROM repasses r
        JOIN administradores a ON r.destinatario_id = a.id
        JOIN vendedores v ON r.vendedor_id = v.id
        ORDER BY r.data DESC
        LIMIT 10;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar últimos repasses feitos:', err);
            res.status(500).json({ error: 'Erro ao buscar últimos repasses feitos.' });
            return;
        }
        res.json(results);
    });
});

// Rota para registrar um novo repasse (POST /api/divisao-lucros/repasses)
router.post('/repasses', autenticar, (req, res) => {
    const { pedidoId, destinatarioId, vendedorId, valor, moeda } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!pedidoId || !destinatarioId || !vendedorId || !valor || !moeda) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'INSERT INTO repasses (pedido_id, destinatario_id, vendedor_id, data, valor, moeda) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [pedidoId, destinatarioId, vendedorId, new Date(), valor, moeda], (err, result) => {
        if (err) {
            console.error('Erro ao registrar repasse:', err);
            res.status(500).json({ error: 'Erro ao registrar repasse.' });
            return;
        }
        res.json({ message: 'Repasse registrado com sucesso!', id: result.insertId });
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter os repasses pendentes para produção (GET /api/divisao-lucros/repasses-producao)
router.get('/repasses-producao', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.data_criacao,
            p.descricao,
            p.moeda,
            p.lucro_venda,
            p.valor_venda,
            pr.nome AS produtor,
            v.nome AS vendedor
        FROM 
            pedidos p
        JOIN 
            produtores pr ON p.produtor_id = pr.id
        JOIN 
            vendedores v ON p.vendedor_id = v.id
        WHERE 
            p.status = "Finalizado" AND p.repasse_comissao = 0;
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
    const sql = 'SELECT * FROM pedidos WHERE status = "Finalizado" AND repasse_sociedade = 0';
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
    const sql = 'SELECT * FROM repasses ORDER BY data DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar últimos repasses feitos:', err);
            res.status(500).json({ error: 'Erro ao buscar últimos repasses feitos.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter todos os vendedores (GET /api/divisao-lucros/vendedores)
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

// Rota para obter todos os produtores (GET /api/divisao-lucros/produtores)
router.get('/produtores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM produtores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtores:', err);
            res.status(500).json({ error: 'Erro ao buscar produtores.' });
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

// Rota para atualizar um pedido após o repasse (PUT /api/divisao-lucros/pedidos/:id)
router.put('/pedidos/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const { repasseComissao, repasseSociedade } = req.body;

    // Verifica se os campos obrigatórios foram fornecidos
    if (repasseComissao === undefined || repasseSociedade === undefined) {
        return res.status(400).json({ error: 'Os campos repasseComissao e repasseSociedade são obrigatórios.' });
    }

    const sql = 'UPDATE pedidos SET repasseComissao = ?, repasseSociedade = ? WHERE id = ?';
    db.query(sql, [repasseComissao, repasseSociedade, pedidoId], (err, result) => {
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

// Rota para obter todos os administradores (GET /api/divisao-lucros/administradores)
router.get('/administradores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM administradores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar administradores:', err);
            res.status(500).json({ error: 'Erro ao buscar administradores.' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
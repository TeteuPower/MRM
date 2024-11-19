const express = require('express');
const router = express.Router();
const { db } = require('../db');
const autenticar = require('../middleware/auth');

// Rota para criar um novo vendedor (POST /api/vendedores)
router.post('/', autenticar, (req, res) => {
    const { nome } = req.body;

    // Verifica se o nome do vendedor foi fornecido
    if (!nome) {
        return res.status(400).json({ error: 'O nome do vendedor é obrigatório.' });
    }

    const sql = 'INSERT INTO vendedores (nome) VALUES (?)';
    db.query(sql, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao criar vendedor:', err);
            res.status(500).json({ error: 'Erro ao criar vendedor.' });
            return;
        }
        res.json({ message: 'Vendedor criado com sucesso!', id: result.insertId });
    });
});

// Rota para obter todos os funcionários (GET /api/funcionarios)
router.get('/', autenticar, (req, res) => {
    const sql = 'SELECT * FROM vendedores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar funcionários:', err);
            res.status(500).json({ error: 'Erro ao buscar funcionários.' });
            return;
        }
        res.json(results);
    });
});

// Rota para criar um novo produtor (POST /api/produtores)
router.post('/produtores', autenticar, (req, res) => {
    const { nome } = req.body;

    // Verifica se o nome do produtor foi fornecido
    if (!nome) {
        return res.status(400).json({ error: 'O nome do produtor é obrigatório.' });
    }

    const sql = 'INSERT INTO produtores (nome) VALUES (?)';
    db.query(sql, [nome], (err, result) => {
        if (err) {
            console.error('Erro ao criar produtor:', err);
            res.status(500).json({ error: 'Erro ao criar produtor.' });
            return;
        }
        res.json({ message: 'Produtor criado com sucesso!', id: result.insertId });
    });
});

// Rota para obter todos os funcionários (GET /api/funcionarios)
router.get('/produtores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM produtores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtor:', err);
            res.status(500).json({ error: 'Erro ao buscar produtor.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter o resumo financeiro do administrador (GET /api/financeiro/:administradorId)
router.get('/:administradorId', autenticar, (req, res) => {
    const administradorId = req.params.administradorId;

    // Consulta SQL para obter o resumo financeiro do administrador
    const sql = `
        SELECT 
            (SELECT SUM(valor_venda) FROM pedidos WHERE vendedor_id = ?) AS vendas_totais,
            (SELECT SUM(CASE WHEN moeda = 'real' THEN valor_venda ELSE 0 END) FROM pedidos WHERE vendedor_id = ?) AS vendas_totais_reais,
            (SELECT SUM(CASE WHEN moeda = 'dolar' THEN valor_venda ELSE 0 END) FROM pedidos WHERE vendedor_id = ?) AS vendas_totais_dolares,
            (SELECT SUM(CASE WHEN moeda = 'real' THEN valor_frete ELSE 0 END) FROM pedidos WHERE vendedor_id = ?) AS frete_total_reais,
            (SELECT SUM(CASE WHEN moeda = 'dolar' THEN valor_frete ELSE 0 END) FROM pedidos WHERE vendedor_id = ?) AS frete_total_dolares,
            (SELECT SUM(valor) FROM pagamentos WHERE vendedor_id = ?) AS repasses_recebidos,
            (SELECT SUM(CASE WHEN moeda = 'real' THEN valor ELSE 0 END) FROM pagamentos WHERE vendedor_id = ?) AS repasses_recebidos_reais,
            (SELECT SUM(CASE WHEN moeda = 'dolar' THEN valor ELSE 0 END) FROM pagamentos WHERE vendedor_id = ?) AS repasses_recebidos_dolares,
            (SELECT SUM(valor) FROM gastos WHERE administrador_id = ?) AS gastos_vendedor,
            (SELECT SUM(CASE WHEN moeda = 'real' THEN valor ELSE 0 END) FROM gastos WHERE administrador_id = ?) AS gastos_vendedor_reais,
            (SELECT SUM(CASE WHEN moeda = 'dolar' THEN valor ELSE 0 END) FROM gastos WHERE administrador_id = ?) AS gastos_vendedor_dolares
        FROM administradores
        WHERE id = ?;
    `;

    db.query(sql, [administradorId, administradorId, administradorId, administradorId, administradorId, administradorId, administradorId, administradorId, administradorId, administradorId, administradorId, administradorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar resumo financeiro:', err);
            res.status(500).json({ error: 'Erro ao buscar resumo financeiro.' });
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;
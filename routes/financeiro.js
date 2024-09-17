const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

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

// Rota para obter os pedidos de um administrador (GET /api/financeiro/pedidos/:administradorId)
router.get('/pedidos/:administradorId', autenticar, (req, res) => {
    const administradorId = req.params.administradorId;
    const sql = 'SELECT * FROM pedidos WHERE administrador_id = ?';
    db.query(sql, [administradorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos do administrador:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos do administrador.' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter o resumo da divisão de lucros para o Rafael (GET /api/divisao-lucros-simples/rafael)
router.get('/rafael', autenticar, (req, res) => {
    const sql = `
        SELECT 
            (
                SELECT SUM(p.lucro_venda) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1 AND p.repasse_comissao = 0
            ) AS saldo_total_rafael_matheus,
            (
                SELECT SUM(p.valor_venda) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1
            ) AS vendas_totais_rafael_matheus,
            (
                SELECT SUM(p.lucro_venda) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1
            ) AS lucro_real_rafael,
            (
                SELECT SUM(rp.valor) 
                FROM repasses_producao rp 
                WHERE rp.vendedor_id = 3
            ) AS comissoes_matheus
        FROM 
            vendedores v
        WHERE 
            v.id = 3;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar resumo do Rafael:', err);
            res.status(500).json({ error: 'Erro ao buscar resumo do Rafael.' });
            return;
        }
        res.json(results[0]);
    });
});

// Rota para obter o resumo da divisão de lucros para a Maithê (GET /api/divisao-lucros-simples/maithe)
router.get('/maithe', autenticar, (req, res) => {
    const sql = `
        SELECT 
            (
                SELECT SUM(p.lucro_venda) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1 AND p.repasse_comissao = 0
            ) AS saldo_total_maithe_matheus,
            (
                SELECT SUM(p.valor_venda) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1
            ) AS vendas_totais_maithe_matheus,
            (
                SELECT SUM(p.lucro_venda) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1
            ) AS lucro_real_maithe,
            (
                SELECT SUM(rp.valor) 
                FROM repasses_producao rp 
                WHERE rp.vendedor_id = 2
            ) AS comissoes_matheus
        FROM 
            vendedores v
        WHERE 
            v.id = 2;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar resumo da Maithê:', err);
            res.status(500).json({ error: 'Erro ao buscar resumo da Maithê.' });
            return;
        }
        res.json(results[0]);
    });
});

// Rota para obter o resumo da divisão de lucros entre Rafael e Maithê (GET /api/divisao-lucros-simples/rafael-maithe)
router.get('/rafael-maithe', autenticar, (req, res) => {
    const sql = `
        SELECT 
            (
                SELECT SUM(p.lucro_venda) 
                FROM pedidos p 
                WHERE p.vendedor_id = 3 AND p.repasse_sociedade = 0 AND p.produtor_id = 2
            ) AS saldo_total_rafael_maithe
        FROM 
            vendedores v
        WHERE 
            v.id = 3;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar resumo do Rafael e Maithê:', err);
            res.status(500).json({ error: 'Erro ao buscar resumo do Rafael e Maithê.' });
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;
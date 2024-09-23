const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter o resumo da divisão de lucros para o Rafael (GET /api/divisao-lucros-simples/rafael)
router.get('/rafael', autenticar, (req, res) => {
    const sql = `
        SELECT 
            (
                SELECT SUM(CASE WHEN moeda = 'real' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1 AND p.repasse_comissao = 0 AND p.status = 'Finalizado'
            ) - (
                SELECT SUM(CASE WHEN moeda = 'real' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 3 AND rp.produtor_id = 1
            ) AS saldo_total_rafael_matheus_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1 AND p.repasse_comissao = 0 AND p.status = 'Finalizado'
            ) - (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 3 AND rp.produtor_id = 1
            ) AS saldo_total_rafael_matheus_dolares,
            (
                SELECT SUM(CASE WHEN moeda = 'real' THEN p.valor_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1
            ) AS vendas_totais_rafael_matheus_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN p.valor_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1
            ) AS vendas_totais_rafael_matheus_dolares,
            (
                SELECT SUM(CASE WHEN moeda = 'real' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1
            ) AS lucro_real_rafael_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 3 AND pr.id = 1
            ) AS lucro_real_rafael_dolares,
            (
                SELECT SUM(CASE WHEN moeda = 'real' THEN rp.valor ELSE 0 END) 
                FROM repasses_producao rp 
                WHERE rp.vendedor_id = 3 AND rp.produtor_id = 1
            ) AS comissoes_matheus_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN rp.valor ELSE 0 END) 
                FROM repasses_producao rp 
                WHERE rp.vendedor_id = 3 AND rp.produtor_id = 1
            ) AS comissoes_matheus_dolares,
                         (
                SELECT SUM(CASE WHEN moeda = 'real' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 3 AND rp.produtor_id = 1
            ) AS comissoes_matheus_reais_parcial,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 3 AND rp.produtor_id = 1
            ) AS comissoes_matheus_dolares_parcial
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
                SELECT SUM(CASE WHEN moeda = 'real' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1 AND p.repasse_comissao = 0 AND p.status = 'Finalizado'
            ) - (
                SELECT SUM(CASE WHEN moeda = 'real' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 2 AND rp.produtor_id = 1
            ) AS saldo_total_maithe_matheus_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1 AND p.repasse_comissao = 0 AND p.status = 'Finalizado'
            ) - (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 2 AND rp.produtor_id = 1
            ) AS saldo_total_maithe_matheus_dolares,
            (
                SELECT SUM(CASE WHEN moeda = 'real' THEN p.valor_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1 AND p.status = 'Finalizado'
            ) AS vendas_totais_maithe_matheus_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN p.valor_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1 AND p.status = 'Finalizado'
            ) AS vendas_totais_maithe_matheus_dolares,
            (
                SELECT SUM(CASE WHEN moeda = 'real' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1 AND p.status = 'Finalizado'
            ) AS lucro_real_maithe_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN p.lucro_venda ELSE 0 END) 
                FROM pedidos p 
                JOIN produtores pr ON p.produtor_id = pr.id 
                WHERE p.vendedor_id = 2 AND pr.id = 1 AND p.status = 'Finalizado'
            ) AS lucro_real_maithe_dolares,
            (
                SELECT SUM(CASE WHEN moeda = 'real' THEN rp.valor ELSE 0 END) 
                FROM repasses_producao rp 
                WHERE rp.vendedor_id = 2 AND rp.produtor_id = 1
            ) AS comissoes_matheus_reais,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN rp.valor ELSE 0 END) 
                FROM repasses_producao rp 
                WHERE rp.vendedor_id = 2 AND rp.produtor_id = 1
            ) AS comissoes_matheus_dolares,
                         (
                SELECT SUM(CASE WHEN moeda = 'real' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 2 AND rp.produtor_id = 1
            ) AS comissoes_matheus_reais_parcial,
            (
                SELECT SUM(CASE WHEN moeda = 'dolar' THEN rp.valor ELSE 0 END) 
                FROM repasses_parciais_producao rp 
                WHERE rp.vendedor_id = 2 AND rp.produtor_id = 1
            ) AS comissoes_matheus_dolares_parcial
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

// Rota para registrar um novo repasse para produção (POST /api/divisao-lucros/repasses-producao)
router.post('/repasses-producao-parcial', autenticar, (req, res) => {
    const { vendedorId, produtorId, valor, moeda, administradorId } = req.body;
    //console.log(req.body);

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!vendedorId || !produtorId || !valor || !moeda || !administradorId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
        // Insere o repasse na tabela repasses_producao
        const sql = 'INSERT INTO repasses_parciais_producao (vendedor_id, produtor_id, valor, moeda, data, administrador_id) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [vendedorId, produtorId, valor, moeda, new Date(), administradorId], (err, result) => {
            if (err) {
                console.error('Erro ao registrar repasse:', err);
                res.status(500).json({ error: 'Erro ao registrar repasse.' });
                return;
            }
            res.json({ message: 'Repasse registrado com sucesso!', id: result.insertId });
        });

});

module.exports = router;
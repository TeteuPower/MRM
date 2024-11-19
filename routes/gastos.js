const express = require('express');
const router = express.Router();
const { db } = require('../db');
const autenticar = require('../middleware/auth');

// Rota para registrar um novo gasto (POST /api/gastos)
router.post('/', autenticar, (req, res) => {
    const { descricao, valor, moeda, administradorId } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!descricao || !valor || !moeda || !administradorId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'INSERT INTO gastos (descricao, valor, moeda, administrador_id, data) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [descricao, valor, moeda, administradorId, new Date()], (err, result) => {
        if (err) {
            console.error('Erro ao registrar gasto:', err);
            res.status(500).json({ error: 'Erro ao registrar gasto.' });
            return;
        }
        res.json({ message: 'Gasto registrado com sucesso!', id: result.insertId });
    });
});

// Rota para obter o saldo total da empresa (GET /api/divisao-lucros-simples/saldo-empresa)
router.get('/saldo-empresa', autenticar, (req, res) => {
    const sql = `
        SELECT 
            (
                SELECT COALESCE(SUM(CASE WHEN moeda = 'real' THEN re.valor ELSE 0 END), 0) 
                FROM repasses_empresa re
            ) - (
                SELECT COALESCE(SUM(CASE WHEN moeda = 'real' THEN g.valor ELSE 0 END), 0) 
                FROM gastos g
            ) AS saldo_empresa_reais,
            (
                SELECT COALESCE(SUM(CASE WHEN moeda = 'dolar' THEN re.valor ELSE 0 END), 0) 
                FROM repasses_empresa re
            ) - (
                SELECT COALESCE(SUM(CASE WHEN moeda = 'dolar' THEN g.valor ELSE 0 END), 0) 
                FROM gastos g
            ) AS saldo_empresa_dolares
        FROM 
            administradores a
        WHERE 
            a.id = 1;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar saldo da empresa:', err);
            res.status(500).json({ error: 'Erro ao buscar saldo da empresa.' });
            return;
        }
        res.json(results[0]);
    });
});

// Rota para obter todos os gastos (GET /api/gastos)
router.get('/', autenticar, (req, res) => {
    const sql = `
        SELECT 
            g.id,
            g.descricao,
            g.valor,
            g.moeda,
            g.data,
            a.nome AS administrador
        FROM 
            gastos g
        JOIN 
            administradores a ON g.administrador_id = a.id
        ORDER BY g.data DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar gastos:', err);
            res.status(500).json({ error: 'Erro ao buscar gastos.' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
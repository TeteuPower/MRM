const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão com o banco de dados

// API administradores
router.get('/', (req, res) => {
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

module.exports = router; // Exporta o roteador
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão com o banco de dados
const autenticar = require('../middleware/auth'); // Importa o middleware de autenticação

// API para obter um administrador por ID
router.get('/:id', autenticar, (req, res) => {
    const adminId = req.params.id;
    const sql = 'SELECT * FROM administradores WHERE id = ?';
    db.query(sql, [adminId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar administrador:', err);
            res.status(500).json({ error: 'Erro ao buscar administrador.' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Administrador não encontrado.' });
        }
    });
});

module.exports = router; // Exporta o roteador
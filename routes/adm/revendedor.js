const express = require('express');
const router = express.Router();
const { dbRevendedor } = require('../../db'); // Importa a conexão com o banco de dados
const autenticarRevendedor = require('../../middleware/authRevendedor'); // Importa o middleware de autenticação

// API para obter um revendedor por ID
router.get('/:id', autenticarRevendedor, (req, res) => {
    const revendedorId = req.params.id;
    const sql = 'SELECT * FROM usuarios WHERE id = ? AND revendedor = 1';
    dbRevendedor.query(sql, [revendedorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar revendedor:', err);
            res.status(500).json({ error: 'Erro ao buscar revendedor.' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Revendedor não encontrado.' });
        }
    });
});

module.exports = router; // Exporta o roteador
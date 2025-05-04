const express = require('express');
const router = express.Router();
const { dbEntregador } = require('../../db'); // Importa a conexão com o banco de dados
const autenticarEnvio = require('../../middleware/authEnvio'); // Importa o middleware de autenticação

// API para obter um revendedor por ID
router.get('/:id', autenticarEnvio, (req, res) => {
    const revendedorId = req.params.id;
    const sql = 'SELECT * FROM usuarios WHERE id = ? AND email_verificado = 1 AND entregador = 1';
    dbEntregador.query(sql, [revendedorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar entregador:', err);
            res.status(500).json({ error: 'Erro ao buscar entregador.' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Entregador não encontrado.' });
        }
    });
});

module.exports = router; // Exporta o roteador
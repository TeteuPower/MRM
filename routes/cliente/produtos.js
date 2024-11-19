const express = require('express');
const router = express.Router();
const {dbClientes} = require('../../db'); // Importa o módulo de conexão com o banco de dados
//console.log(dbClientes);

// Rota para obter os dados do estoque
router.get('/', (req, res) => {
    // Consulta SQL para obter os produtos e suas quantidades
    const sqlProdutos = `(SELECT * FROM produtos)`;
    dbClientes.query(sqlProdutos, (err, results) => {
        if (err) {
            console.error('Erro ao buscar os produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar os produtos.' });
            return;
        }
    })

    // Executa as consultas em paralelo
    Promise.all([
        new Promise((resolve, reject) => {
            dbClientes.query(sqlProdutos, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        }),
    ])
    .then(([produtos]) => {
        res.json({ produtos});
    })
    .catch(err => {
        console.error('Erro ao buscar dados do estoque:', err);
        res.status(500).json({ error: 'Erro ao buscar dados do estoque.' });
    });
});

module.exports = router;
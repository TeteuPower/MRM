const express = require('express');
const router = express.Router();
const {dbClientes} = require('../../db'); // Importa o módulo de conexão com o banco de dados
//console.log(dbClientes);

// Rota para obter os dados do estoque
router.get('/', (req, res) => {
    // Consulta SQL para obter os produtos e suas quantidades
    const sqlProdutos = `(SELECT id, nome, unidade, status, preco, categoria, img_url, descricao, quantidade FROM produtos_site WHERE status = 1)`;
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

// Rota para obter informações dos produtos

router.get('/:id', (req, res) => {
    const produtoId = req.params.id;
    const sql = 'SELECT * FROM produtos_site WHERE id = ?';
    dbClientes.query(sql, [produtoId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            res.status(500).json({ error: 'Erro ao buscar produto.' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Produto nao encontrado.' });
        }
    });
});

module.exports = router;
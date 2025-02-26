const express = require('express');
const router = express.Router();
const { db } = require('../../db'); // Importa o módulo de conexão com o banco de dados
const autenticar = require('../../middleware/auth');

// Rota para obter os dados do estoque
router.get('/', (req, res) => {
    // Consulta SQL para obter os produtos e suas quantidades
    const sqlProdutos = `(SELECT id, nome, unidade, status, preco, categoria, img_url, descricao, quantidade FROM produtos_site)`;
    db.query(sqlProdutos, (err, results) => {
        if (err) {
            console.error('Erro ao buscar os produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar os produtos.' });
            return;
        }
    })

    // Executa as consultas em paralelo
    Promise.all([
        new Promise((resolve, reject) => {
            db.query(sqlProdutos, (err, results) => {
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

// Rota para editar um produto:
router.put('/:id', autenticar, (req, res) => {
    const produtoId = req.params.id;
    const administador = req.usuario.id;
    const { nome, status, preco, categoria, img_url, descricao, quantidade } = req.body;
    const sql = 'UPDATE produtos_site SET nome = ?, status = ?, preco = ?, categoria = ?, img_url = ?, descricao = ?, quantidade = ? WHERE id = ?';
    db.query(sql, [nome, status, preco, categoria, img_url, descricao, quantidade, produtoId], (err, results) => {
        if (err) {
            console.error('Erro ao editar produto:', err);
            res.status(500).json({ error: 'Erro ao editar produto.' });
            return;
        }
        console.log(`Produto de id: ${produtoId} atualizado pelo admin ${administador}`);
        res.json({ message: 'Produto editado com sucesso.' });
    });
});

module.exports = router;
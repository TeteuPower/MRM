const express = require('express');
const router = express.Router();
const { db } = require('../../db'); // Importa o módulo de conexão com o banco de dados
const autenticar = require('../../middleware/auth');

// Rota para obter os dados do estoque
router.get('/', autenticar, (req, res) => {
    // Consulta SQL para obter os cupons
    const sqlProdutos = `(SELECT id, revendedor_id, codigo, desconto, ativo FROM cupons)`;
    db.query(sqlProdutos, (err, results) => {
        if (err) {
            console.error('Erro ao buscar os cupons:', err);
            res.status(500).json({ error: 'Erro ao buscar os cupons.' });
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
    .then(([cupons]) => {
        res.json({ cupons });
    })
    .catch(err => {
        console.error('Erro ao buscar dados do DB:', err);
        res.status(500).json({ error: 'Erro ao buscar dados do DB.' });
    });
});

/*

// Rota para editar um cupom:
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

// Rota para criar um novo cupom
router.post('/', autenticar, (req, res) => {
    const { nome, status, preco, categoria, img_url, descricao, quantidade, unidade_de_medida } = req.body;
    const sql = 'INSERT INTO produtos_site (nome, status, preco, categoria, img_url, descricao, quantidade, unidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, status, preco, categoria, img_url, descricao, quantidade, unidade_de_medida], (err, results) => {
        if (err) {
            console.error('Erro ao criar produto:', err);
            res.status(500).json({ error: 'Erro ao criar produto.' });
            return;
        }
        res.json({ message: 'Produto criado com sucesso.' });
    });
});

// Rota para excluir um cupom:
router.put('/excluir/:id', autenticar, (req, res) => {
    const produtoId = req.params.id;
    const administador = req.usuario.id;
    const { status } = req.body;
    const sql = 'UPDATE produtos_site SET status = ? WHERE id = ?';
    db.query(sql, [ status, produtoId], (err, results) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            res.status(500).json({ error: 'Erro ao excluir produto.' });
            return;
        }
        console.log(`Produto de id: ${produtoId} excluido pelo admin ${administador}`);
        res.json({ message: 'Produto excluido com sucesso.' });
    });
});*/

module.exports = router;
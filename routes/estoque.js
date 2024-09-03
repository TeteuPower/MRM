const express = require('express');
const db = require('../db'); // Importa o módulo de conexão com o banco de dados
const app = express();
const autenticar = require('../middleware/auth'); // Importa o middleware de autenticação
const router = express.Router();

// Rota para obter os dados do estoque
router.get('/', autenticar, (req, res) => {
    // Consulta SQL para obter os produtos e suas quantidades
    const sqlProdutos = `(SELECT * FROM produtos)`;
    db.query(sqlProdutos, (err, results) => {
        if (err) {
            console.error('Erro ao buscar os produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar os produtos.' });
            return;
        }
    })

    // Consulta SQL para obter as matérias-primas e suas quantidades
    const sqlMateriasPrimas = `(SELECT * FROM materias_primas)`
    db.query(sqlMateriasPrimas, (err, results) => {
        if (err) {
            console.error('Erro ao buscar as materias primas:', err);
            res.status(500).json({ error: 'Erro ao buscar as materias primas.' });
            return;
        }
    })

    // Consulta SQL para obter as variedades de rape
    const sqlVariedadesRape = `(SELECT * FROM variedades_rape)`
    db.query(sqlVariedadesRape, (err, results) => {
        if (err) {
            console.error('Erro ao buscar as variedades de rapé:', err);
            res.status(500).json({ error: 'Erro ao buscar as variedades de rapé:' });
            return;
        }
    })

    // Consulta SQL para obter as variedades de cinzas
    const sqlVariedadesCinzas = `(SELECT * FROM variedades_cinzas)`
    db.query(sqlVariedadesCinzas, (err, results) => {
        if (err) {
            console.error('Erro ao buscar as variedades de cinzas:', err);
            res.status(500).json({ error: 'Erro ao buscar as variedades de cinzas:' });
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
        new Promise((resolve, reject) => {
            db.query(sqlMateriasPrimas, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(sqlVariedadesRape, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(sqlVariedadesCinzas, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        })
    ])
    .then(([produtos, materiasPrimas, variedadesRape, variedadesCinzas]) => {
        res.json({ produtos, materiasPrimas, variedadesRape, variedadesCinzas});
    })
    .catch(err => {
        console.error('Erro ao buscar dados do estoque:', err);
        res.status(500).json({ error: 'Erro ao buscar dados do estoque.' });
    });
});

//Rota para alterar quantidade de Rapé no estoque
router.put('/', autenticar, (req, res) => {
    const { nome, quantidade } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!nome || !quantidade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'UPDATE variedades_rape SET quantidade = quantidade + ? WHERE nome = ?';
    db.query(sql, [quantidade, nome], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar variedade de rapé:', err);
            res.status(500).json({ error: 'Erro ao atualizar variedade de rapé.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Variedade de rapé atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Variedade de rapé não encontrada.' });
        }
    });
});

// Rota para atualizar a quantidade total de couripes (PUT /api/estoque/couripes)
router.put('/couripes', autenticar, (req, res) => {
    const { quantidade } = req.body;

    // Verifica se a quantidade foi fornecida
    if (!quantidade) {
        return res.status(400).json({ error: 'A quantidade é obrigatória.' });
    }

    const sql = 'UPDATE produtos SET quantidade = quantidade + ? WHERE nome = "Couripes"';
    db.query(sql, [quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade total de couripes:', err);
            res.status(500).json({ error: 'Erro ao atualizar quantidade total de couripes.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Quantidade de couripes atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Couripes não encontrado.' });
        }
    });
});


module.exports = router;
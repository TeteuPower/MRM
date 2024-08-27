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

module.exports = router;
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

// Rota para atualizar a quantidade total de Sananga
router.put('/sananga', autenticar, (req, res) => {
    const { quantidade } = req.body;

    // Verifica se a quantidade foi fornecida
    if (!quantidade) {
        return res.status(400).json({ error: 'A quantidade é obrigatória.' });
    }

    const sql = 'UPDATE produtos SET quantidade = quantidade + ? WHERE nome = "Sananga"';
    db.query(sql, [quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade total de Sanangas:', err);
            res.status(500).json({ error: 'Erro ao atualizar quantidade total de Sanangas.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Quantidade de Sanagas atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Sanangas não encontradas.' });
        }
    });
});

// Rota para atualizar a quantidade total de Artesanatos (PUT /api/estoque/artesanatos)
router.put('/artesanatos', autenticar, (req, res) => {
    const { quantidade } = req.body;

    // Verifica se a quantidade foi fornecida
    if (!quantidade) {
        return res.status(400).json({ error: 'A quantidade é obrigatória.' });
    }

    const sql = 'UPDATE produtos SET quantidade = quantidade + ? WHERE nome = "Artesanatos"';
    db.query(sql, [quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade total de Artesanatos:', err);
            res.status(500).json({ error: 'Erro ao atualizar quantidade total de Artesanatos.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Quantidade de Artesanatos atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Artesanatos não encontrados.' });
        }
    });
});

// Rota para atualizar a quantidade total de Tabaco (PUT /api/estoque/tabaco)
router.put('/tabaco', autenticar, (req, res) => {
    const { quantidade } = req.body;

    // Verifica se a quantidade foi fornecida
    if (!quantidade) {
        return res.status(400).json({ error: 'A quantidade é obrigatória.' });
    }

    const sql = 'UPDATE materias_primas SET quantidade = quantidade + ? WHERE nome = "Tabaco"';
    db.query(sql, [quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade total de Tabaco:', err);
            res.status(500).json({ error: 'Erro ao atualizar quantidade total de Tabaco.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Quantidade de Tabaco atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Tabaco não encontrado.' });
        }
    });
});

// Rota para atualizar a quantidade total de Cinzas (PUT /api/estoque/cinzas)
router.put('/cinzas', autenticar, (req, res) => {
    const { quantidade, tipo } = req.body;

    // Verifica se a quantidade e o tipo foram fornecidos
    if (!quantidade || !tipo) {
        return res.status(400).json({ error: 'A quantidade e o tipo são obrigatórios.' });
    }

    const sql = 'UPDATE variedades_cinzas SET quantidade = quantidade + ? WHERE nome = ?';
    db.query(sql, [quantidade, tipo], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade total de Cinzas:', err);
            res.status(500).json({ error: 'Erro ao atualizar quantidade total de Cinzas.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Quantidade de Cinzas atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Cinzas não encontradas.' });
        }
    });
});

// Rota para atualizar a quantidade total de Pacotes (PUT /api/estoque/pacotes)
router.put('/pacotes', autenticar, (req, res) => {
    const { quantidade } = req.body;

    // Verifica se a quantidade foi fornecida
    if (!quantidade) {
        return res.status(400).json({ error: 'A quantidade é obrigatória.' });
    }

    const sql = 'UPDATE materias_primas SET quantidade = quantidade + ? WHERE nome = "Pacotes"';
    db.query(sql, [quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade total de Pacotes:', err);
            res.status(500).json({ error: 'Erro ao atualizar quantidade total de Pacotes.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Quantidade de Pacotes atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Pacotes não encontrados.' });
        }
    });
});

// Rota para atualizar a quantidade total de Adesivos Grandes (PUT /api/estoque/adesivos-grandes)
router.put('/adesivos-grandes', autenticar, (req, res) => {
    const { quantidade } = req.body;

    // Verifica se a quantidade foi fornecida
    if (!quantidade) {
        return res.status(400).json({ error: 'A quantidade é obrigatória.' });
    }

    const sql = 'UPDATE materias_primas SET quantidade = quantidade + ? WHERE nome = "Adesivos Grandes"';
    db.query(sql, [quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar quantidade total de Adesivos Grandes:', err);
            res.status(500).json({ error: 'Erro ao atualizar quantidade total de Adesivos Grandes.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Quantidade de Adesivos Grandes atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Adesivos Grandes não encontrados.' });
        }
    });
});

// Rota para criar uma nova variedade de rapé (POST /api/estoque/variedades-rape)
router.post('/adicionar-variedade-rape', autenticar, (req, res) => {
    const { nome, quantidade } = req.body;

    const sql = 'INSERT INTO variedades_rape (produto_id, nome, quantidade) VALUES (?, ?, ?)';
    db.query(sql, [1, nome, quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao criar variedade:', err);
            res.status(500).json({ error: 'Erro ao criar variedade.' });
            return;
        }
        res.json({ message: 'Variedade criada com sucesso!', id: result.insertId });
    });
});


module.exports = router;
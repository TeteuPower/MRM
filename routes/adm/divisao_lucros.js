const express = require('express');
const router = express.Router();
const { db } = require('../../db');
const autenticar = require('../../middleware/auth');

// Rota para obter os repasses pendentes para produção (GET /api/divisao-lucros/repasses-producao)
router.get('/repasses-producao', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.data_criacao,
            p.descricao,
            p.moeda,
            p.lucro_venda,
            p.valor_venda,
            p.vendedor_id,
            p.produtor_id,
            p.cliente_id,
            pr.nome AS produtor,
            v.nome AS vendedor,
            a.nome AS cliente
        FROM 
            pedidos p
        JOIN 
            produtores pr ON p.produtor_id = pr.id
        JOIN 
            vendedores v ON p.vendedor_id = v.id
        JOIN 
            clientes a ON p.cliente_id = a.id
        WHERE 
            p.status = "Finalizado" AND p.repasse_comissao = 0;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses pendentes para produção:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses pendentes para produção.' });
            return;
        }
        res.json(results);
    });
});

router.get('/repasses-producao-rafael', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.data_criacao,
            p.descricao,
            p.moeda,
            p.lucro_venda,
            p.valor_venda,
            p.vendedor_id,
            p.produtor_id,
            p.cliente_id,
            pr.nome AS produtor,
            v.nome AS vendedor,
            a.nome AS cliente
        FROM 
            pedidos p
        JOIN 
            produtores pr ON p.produtor_id = pr.id
        JOIN 
            vendedores v ON p.vendedor_id = v.id
        JOIN 
            clientes a ON p.cliente_id = a.id
        WHERE 
            p.status = "Finalizado" AND p.repasse_comissao = 0 AND p.vendedor_id = 3;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses pendentes para produção:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses pendentes para produção.' });
            return;
        }
        res.json(results);
    });
});

router.get('/repasses-producao-maithe', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.data_criacao,
            p.descricao,
            p.moeda,
            p.lucro_venda,
            p.valor_venda,
            p.vendedor_id,
            p.produtor_id,
            p.cliente_id,
            pr.nome AS produtor,
            v.nome AS vendedor,
            a.nome AS cliente
        FROM 
            pedidos p
        JOIN 
            produtores pr ON p.produtor_id = pr.id
        JOIN 
            vendedores v ON p.vendedor_id = v.id
        JOIN 
            clientes a ON p.cliente_id = a.id
        WHERE 
            p.status = "Finalizado" AND p.repasse_comissao = 0 AND p.vendedor_id = 2;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses pendentes para produção:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses pendentes para produção.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os repasses pendentes para administradores (GET /api/divisao-lucros/repasses-producao)
router.get('/repasses-administradores', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.data_criacao,
            p.descricao,
            p.moeda,
            p.lucro_venda,
            p.valor_venda,
            p.vendedor_id,
            pr.nome AS produtor,
            v.nome AS vendedor
        FROM 
            pedidos p
        JOIN 
            produtores pr ON p.produtor_id = pr.id
        JOIN 
            vendedores v ON p.vendedor_id = v.id
        WHERE 
            p.status = "Finalizado" AND p.repasse_sociedade = 0;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses pendentes para administradores:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses pendentes para administradores.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os repasses pendentes para Empresa (GET /api/divisao-lucros/repasses-producao)
router.get('/repasses-empresa', autenticar, (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.moeda,
            p.valor_insumos,
            p.valor_frete,
            p.vendedor_id,
            v.nome AS vendedor
        FROM 
            pedidos p
        JOIN 
            produtores pr ON p.produtor_id = pr.id
        JOIN 
            vendedores v ON p.vendedor_id = v.id
        WHERE 
            p.status = "Finalizado" AND p.repasse_insumos = 0;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses pendentes para empresa:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses pendentes para empresa.' });
            return;
        }
        res.json(results);
    });
});
// Rota para obter os últimos repasses feitos
// Rota para obter os últimos repasses feitos para produção (GET /api/divisao-lucros/repasses-feitos-producao)
router.get('/repasses-feitos-producao', autenticar, (req, res) => {
    const sql = `
        SELECT 
            rp.id,
            rp.vendedor_id,
            rp.produtor_id,
            rp.valor,
            rp.moeda,
            rp.data,
            a.nome AS administrador,
            v.nome AS vendedor,
            pr.nome AS produtor
        FROM 
            repasses_parciais_producao rp
        JOIN 
            administradores a ON rp.administrador_id = a.id
        JOIN 
            vendedores v ON rp.vendedor_id = v.id
        JOIN 
            produtores pr ON rp.produtor_id = pr.id
        ORDER BY rp.data DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar últimos repasses feitos:', err);
            res.status(500).json({ error: 'Erro ao buscar últimos repasses feitos.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os repasses feitos para vendedores (GET /api/divisao-lucros/repasses-feitos-vendedores)
router.get('/repasses-feitos-vendedores', autenticar, (req, res) => {
    const sql = `
        SELECT 
            rp.id,
            rp.pedido_id,
            rp.vendedor_id,
            rp.vendedor_destinatario_id,
            rp.valor,
            rp.moeda,
            rp.data,
            rp.administrador_id,
            a.nome AS administrador,
            v.nome AS vendedor,
            vd.nome AS vendedor_destinatario
        FROM 
            repasses_vendedores rp
        JOIN 
            administradores a ON rp.administrador_id = a.id
        JOIN 
            vendedores v ON rp.vendedor_id = v.id
        LEFT JOIN 
            vendedores vd ON rp.vendedor_destinatario_id = vd.id
        ORDER BY rp.data DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar últimos repasses feitos:', err);
            res.status(500).json({ error: 'Erro ao buscar últimos repasses feitos.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os repasses feitos para empresa (GET /api/divisao-lucros/repasses-feitos-empresa)
router.get('/repasses-feitos-empresa', autenticar, (req, res) => {
    const sql = `
        SELECT 
            rp.id,
            rp.pedido_id,
            rp.valor,
            rp.moeda,
            rp.data,
            a.nome AS administrador,
            v.nome AS vendedor
        FROM 
            repasses_empresa rp
        JOIN 
            administradores a ON rp.administrador_id = a.id
        JOIN 
            vendedores v ON rp.vendedor_id = v.id
        ORDER BY rp.data DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar últimos repasses feitos:', err);
            res.status(500).json({ error: 'Erro ao buscar últimos repasses feitos.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os repasses para a empresa/administrador (GET /api/divisao-lucros-simples/repasses-empresa-administrador)
router.get('/repasses-empresa-administrador', autenticar, (req, res) => {
    const sql = `
        SELECT 
            re.id,
            re.pedido_id,
            re.valor,
            re.moeda,
            re.data,
            v.nome AS vendedor,
            a.nome AS administrador
        FROM 
            repasses_empresa re
        JOIN 
            vendedores v ON re.vendedor_id = v.id
        JOIN 
            administradores a ON re.administrador_id = a.id
        ORDER BY re.data DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar repasses para a empresa:', err);
            res.status(500).json({ error: 'Erro ao buscar repasses para a empresa.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter todos os vendedores (GET /api/divisao-lucros/vendedores)
router.get('/vendedores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM vendedores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendedores:', err);
            res.status(500).json({ error: 'Erro ao buscar vendedores.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter todos os produtores (GET /api/divisao-lucros/produtores)
router.get('/produtores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM produtores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtores:', err);
            res.status(500).json({ error: 'Erro ao buscar produtores.' });
            return;
        }
        res.json(results);
    });
});

// Rota para registrar um novo repasse (POST /api/divisao-lucros/repasses)
router.post('/repasses-producao', autenticar, (req, res) => {
    const { pedidoId, produtorId, vendedorId, valor, administradorId, moeda, finalizaComissao } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!pedidoId || !produtorId || !vendedorId || !administradorId || !moeda) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

        // Atualiza o campo repasse_comissao do pedido
        const sqlUpdatePedido = 'UPDATE pedidos SET repasse_comissao = ? WHERE id = ?';
        db.query(sqlUpdatePedido, [finalizaComissao, pedidoId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar pedido:', err);
                res.status(500).json({ error: 'Erro ao registrar repasse.' });
                return;
            }

        const sql = 'INSERT INTO repasses_producao (pedido_id, vendedor_id, produtor_id, valor, moeda, data, administrador_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [pedidoId, vendedorId, produtorId, valor, moeda, new Date(), administradorId], (err, result) => {
            if (err) {
                console.error('Erro ao registrar repasse:', err);
                res.status(500).json({ error: 'Erro ao registrar repasse.' });
                return;
            }
            res.json({ message: 'Repasse registrado com sucesso!', id: result.insertId });
        });
    });
});

// Rota para registrar um novo repasse (POST /api/divisao-lucros/repasses)
router.post('/repasses-vendedores', autenticar, (req, res) => {
    const { pedidoId, vendedorId, vendedorDestinatarioId, valor, administradorId, moeda, finalizaComissao } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!pedidoId || !vendedorId || !administradorId || !moeda) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

        // Atualiza o campo repasse_comissao do pedido
        const sqlUpdatePedido = 'UPDATE pedidos SET repasse_sociedade = ? WHERE id = ?';
        db.query(sqlUpdatePedido, [finalizaComissao, pedidoId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar pedido:', err);
                res.status(500).json({ error: 'Erro ao registrar repasse.' });
                return;
            }

        const sql = 'INSERT INTO repasses_vendedores (pedido_id, vendedor_id, vendedor_destinatario_id, valor, administrador_id, moeda, data) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [pedidoId, vendedorId, vendedorDestinatarioId, valor, administradorId, moeda, new Date()], (err, result) => {
            if (err) {
                console.error('Erro ao registrar repasse:', err);
                res.status(500).json({ error: 'Erro ao registrar repasse.' });
                return;
            }
            res.json({ message: 'Repasse registrado com sucesso!', id: result.insertId });
        });
    });
});

// Rota para registrar um novo repasse (POST /api/divisao-lucros/repasses)
router.post('/repasses-vendedores-parcial', autenticar, (req, res) => {
    const { vendedorId, vendedorDestinatarioId, valor, administradorId, moeda } = req.body;

    const sql = 'INSERT INTO repasses_vendedores (vendedor_id, vendedor_destinatario_id, valor, administrador_id, moeda, data) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [vendedorId, vendedorDestinatarioId, valor, administradorId, moeda, new Date()], (err, result) => {
        if (err) {
            console.error('Erro ao registrar repasse:', err);
            res.status(500).json({ error: 'Erro ao registrar repasse.' });
            return;
        }
        res.json({ message: 'Repasse registrado com sucesso!', id: result.insertId });
    });
});

// Rota para registrar um novo repasse (POST /api/divisao-lucros/repasses)
router.post('/repasses-empresa', autenticar, (req, res) => {
    const { pedidoId, vendedorId, valor, moeda, administradorId, finalizaComissao } = req.body;

        // Atualiza o campo repasse_comissao do pedido
        const sqlUpdatePedido = 'UPDATE pedidos SET repasse_insumos = ? WHERE id = ?';
        db.query(sqlUpdatePedido, [finalizaComissao, pedidoId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar pedido:', err);
                res.status(500).json({ error: 'Erro ao registrar repasse.' });
                return;
            }
            
        const sql = 'INSERT INTO repasses_empresa (pedido_id, vendedor_id, valor, moeda, data, administrador_id) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [pedidoId, vendedorId, valor, moeda, new Date(), administradorId], (err, result) => {
            if (err) {
                console.error('Erro ao registrar repasse:', err);
                res.status(500).json({ error: 'Erro ao registrar repasse.' });
                return;
            }
            res.json({ message: 'Repasse registrado com sucesso!', id: result.insertId });
        });
    });
});

// Rota para atualizar um pedido após o repasse (PUT /api/divisao-lucros/pedidos/:id)
router.put('/pedidos/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const { repasseComissao, repasseSociedade } = req.body;

    // Verifica se os campos obrigatórios foram fornecidos
    if (repasseComissao === undefined || repasseSociedade === undefined) {
        return res.status(400).json({ error: 'Os campos repasseComissao e repasseSociedade são obrigatórios.' });
    }

    const sql = 'UPDATE pedidos SET repasseComissao = ?, repasseSociedade = ? WHERE id = ?';
    db.query(sql, [repasseComissao, repasseSociedade, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Pedido atualizado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Pedido não encontrado.' });
        }
    });
});

// Rota para obter todos os administradores (GET /api/divisao-lucros/administradores)
router.get('/administradores', autenticar, (req, res) => {
    const sql = 'SELECT * FROM administradores';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar administradores:', err);
            res.status(500).json({ error: 'Erro ao buscar administradores.' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
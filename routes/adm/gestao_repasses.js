const express = require('express');
const router = express.Router();
const { db } = require('../../db'); // Conexão ADMIN
const autenticar = require('../../middleware/auth'); // Autenticação ADMIN
const axios = require('axios'); // Para a cotação do dólar

// Função para obter a cotação do dólar (reutilizada)
async function obterCotacaoDolar() {
    try {
        const response = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL');
        return parseFloat(response.data.USDBRL.bid);
    } catch (error) {
        console.error('Erro ao obter cotação do dólar:', error.message);
        throw new Error('Não foi possível obter a cotação do dólar.');
    }
}

// ===================================================================
// ROTA 1: BUSCAR COMISSÕES PRONTAS PARA PAGAMENTO (VALORES REAIS)
// ===================================================================
router.get('/prontos', autenticar, async (req, res) => {
    try {
        const sql = `
            SELECT
                e.id AS envio_id,
                e.pedido_id, -- Essencial para a referência de pagamento
                e.wb,
                c.nome AS nome_cliente,
                e.frete_final_brl,
                (e.frete_final_brl * 0.15) AS valor_comissao
            FROM envios e
            JOIN pedidos p ON e.pedido_id = p.id
            JOIN clientes c ON p.cliente_id = c.id
            WHERE
                e.fatura_gerada = TRUE
            AND
                e.repasse_efetuado = FALSE
            ORDER BY e.data_envio ASC;
        `;
        const [results] = await db.promise().query(sql);
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar repasses prontos:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// ===================================================================
// ROTA 2: BUSCAR COMISSÕES A CONFIRMAR (VALORES ESTIMADOS)
// ===================================================================
router.get('/estimados', autenticar, async (req, res) => {
    try {
        const cotacaoDolar = await obterCotacaoDolar();
        const sql = `
            SELECT
                e.wb,
                c.nome AS nome_cliente,
                e.frete AS frete_usd
            FROM envios e
            JOIN pedidos p ON e.pedido_id = p.id
            JOIN clientes c ON p.cliente_id = c.id
            WHERE
                e.fatura_gerada = FALSE
            AND
                e.repasse_efetuado = FALSE
            ORDER BY e.data_envio ASC;
        `;
        const [results] = await db.promise().query(sql);

        const estimadosProcessados = results.map(item => {
            const freteBRL = parseFloat(item.frete_usd) * cotacaoDolar;
            return {
                ...item,
                comissao_estimada_brl: freteBRL * 0.15
            };
        });

        res.json(estimadosProcessados);
    } catch (error) {
        console.error('Erro ao buscar repasses estimados:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================================================
// ROTA 3: CRIAR UM NOVO LOTE DE REPASSE (A GRANDE MÁGICA)
// ===================================================================
router.post('/criar-lote', autenticar, async (req, res) => {
    const { metodo_pagamento, observacao_lote, referencia_pagamento, valor_total_lote, itens_lote } = req.body;

    if (!metodo_pagamento || !referencia_pagamento || !valor_total_lote || !itens_lote || itens_lote.length === 0) {
        return res.status(400).json({ error: 'Dados insuficientes para criar o lote.' });
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        // Passo 1: Descobrir o ID do entregador (pegamos do primeiro envio da lista)
        const [primeiroEnvio] = await connection.query('SELECT entregador_id FROM envios WHERE id = ?', [itens_lote[0].envio_id]);
        const entregadorId = primeiroEnvio[0].entregador_id;

        // Passo 2: Inserir o lote na tabela 'lotes_repasses'
        const sqlInsertLote = `
            INSERT INTO lotes_repasses (entregador_id, valor_total_lote, metodo_pagamento, referencia_pagamento, observacao_lote, data_lote_repasse)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const [resultLote] = await connection.query(sqlInsertLote, [entregadorId, valor_total_lote, metodo_pagamento, referencia_pagamento, observacao_lote]);
        const novoLoteId = resultLote.insertId;

        // Passo 3: Inserir os itens do lote na tabela 'itens_lote_repasse' (Bulk Insert)
        const sqlInsertItens = 'INSERT INTO itens_lote_repasse (lote_repasse_id, envio_id, valor_comissao_envio) VALUES ?';
        const valuesItens = itens_lote.map(item => [novoLoteId, item.envio_id, item.valor_comissao]);
        await connection.query(sqlInsertItens, [valuesItens]);

        // Passo 4: Atualizar a flag 'repasse_efetuado' nos envios que foram pagos
        const enviosIds = itens_lote.map(item => item.envio_id);
        const sqlUpdateEnvios = 'UPDATE envios SET repasse_efetuado = TRUE WHERE id IN (?)';
        await connection.query(sqlUpdateEnvios, [enviosIds]);

        // Se tudo deu certo, confirma a transação
        await connection.commit();
        res.status(201).json({ message: `Lote #${novoLoteId} criado com sucesso!` });

    } catch (error) {
        await connection.rollback(); // Desfaz tudo em caso de erro
        console.error('Erro na transação de criação de lote:', error);
        res.status(500).json({ error: 'Falha ao criar o lote. A operação foi revertida.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
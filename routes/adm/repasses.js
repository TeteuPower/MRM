const express = require('express');
const router = express.Router();
const { dbEntregador } = require('../../db'); // Sua conexão com o banco de dados
const autenticarEnvio = require('../../middleware/authEnvio'); // Seu middleware de autenticação

// --- Rota para buscar Repasses Pendentes do Entregador Logado ---
router.get('/repasses/pendentes', autenticarEnvio, async (req, res) => {
    const entregadorId = req.usuario.id;

    try {
        // Consulta para buscar envios NÃO repassados (onde repasse_efetuado = FALSE na tabela envios)
        // E que pertencem ao entregador logado.
        // Se você optou por controlar o repasse apenas pela existência na tabela itens_lote_repasse,
        // a query seria diferente (ver JOIN com itens_lote_repasse e checar se é NULL).
        // Vamos assumir por agora que você ainda tem a coluna `repasse_efetuado` na tabela `envios`.
        const sql = `
            SELECT
                e.id AS envio_id,
                e.pedido_id AS pedido_original_id,
                p.caixa_modelo,             -- Exemplo de dado da tabela pedidos
                e.data_envio,
                e.frete,
                (e.frete * 0.15) AS comissao_pendente
            FROM envios e
            JOIN pedidos p ON e.pedido_id = p.id -- Fazendo JOIN com pedidos para pegar info como caixa_modelo
            WHERE e.entregador_id = ?
            AND e.repasse_efetuado = FALSE
            ORDER BY e.data_envio DESC;
        `;

        dbEntregador.query(sql, [entregadorId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar repasses pendentes:', err);
                return res.status(500).json({ error: 'Erro interno ao buscar repasses pendentes.' });
            }
            // O frontend espera um objeto com uma chave "pendentes" contendo o array
            res.json({ pendentes: results });
        });

    } catch (error) {
        console.error('Erro inesperado em GET /repasses/pendentes:', error);
        res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

// --- Rota para buscar Histórico de Lotes de Repasse do Entregador Logado ---
router.get('/repasses/historico', autenticarEnvio, async (req, res) => {
    const entregadorId = req.usuario.id;

    try {
        const sql = `
            SELECT
                lr.id_lote,
                lr.data_lote_repasse,
                lr.valor_total_lote,
                lr.metodo_pagamento,
                lr.referencia_pagamento,
                lr.observacao_lote
            FROM lotes_repasses lr
            WHERE lr.entregador_id = ?
            ORDER BY lr.data_lote_repasse DESC;
        `;

        dbEntregador.query(sql, [entregadorId], (err, results) => {
            if (err) {
                console.error('Erro ao buscar histórico de repasses:', err);
                return res.status(500).json({ error: 'Erro interno ao buscar histórico de repasses.' });
            }
            res.json(results); // Retorna diretamente o array de lotes
        });

    } catch (error) {
        console.error('Erro inesperado em GET /repasses/historico:', error);
        res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

// --- Rota para buscar Detalhes (envios) de um Lote de Repasse específico ---
router.get('/repasses/lote/:loteId', autenticarEnvio, async (req, res) => {
    const entregadorId = req.usuario.id; // Para garantir que o entregador só veja seus lotes
    const { loteId } = req.params;

    if (!loteId || isNaN(loteId)) {
        return res.status(400).json({ error: 'ID do lote inválido.' });
    }

    try {
        // Primeiro, verificar se o lote pertence ao entregador (opcional, mas bom para segurança)
        // Esta query pode ser combinada com a próxima se desejar.
        const sqlVerificaLote = `SELECT id_lote FROM lotes_repasses WHERE id_lote = ? AND entregador_id = ?`;
        dbEntregador.query(sqlVerificaLote, [loteId, entregadorId], (errVerifica, resVerifica) => {
            if (errVerifica) {
                console.error(`Erro ao verificar lote ${loteId} para entregador ${entregadorId}:`, errVerifica);
                return res.status(500).json({ error: 'Erro interno ao verificar o lote.' });
            }
            if (resVerifica.length === 0) {
                return res.status(404).json({ error: 'Lote não encontrado ou não pertence a este entregador.' });
            }

            // Se o lote pertence, buscar os itens do lote
            const sqlDetalhes = `
                SELECT
                    ilr.envio_id,
                    ilr.valor_comissao_envio,
                    e.frete AS frete_original_do_envio,
                    p.caixa_modelo -- Exemplo, pegando da tabela pedidos
                FROM itens_lote_repasse ilr
                JOIN envios e ON ilr.envio_id = e.id
                JOIN pedidos p ON e.pedido_id = p.id -- JOIN para pegar info do pedido original
                WHERE ilr.lote_repasse_id = ?
                ORDER BY ilr.envio_id ASC;
            `;

            dbEntregador.query(sqlDetalhes, [loteId], (err, results) => {
                if (err) {
                    console.error(`Erro ao buscar detalhes do lote ${loteId}:`, err);
                    return res.status(500).json({ error: 'Erro interno ao buscar detalhes do lote.' });
                }
                res.json(results); // Retorna o array de envios/itens do lote
            });
        });

    } catch (error) {
        console.error(`Erro inesperado em GET /repasses/lote/${loteId}:`, error);
        res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

module.exports = router;
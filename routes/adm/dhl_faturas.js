const express = require('express');
const router = express.Router();
const { dbEntregador } = require('../../db');
const autenticarEnvio = require('../../middleware/authEnvio');

/**
 * @route   GET /api/dhl/pendentes
 * @desc    Busca todos os envios do entregador que ainda não têm fatura gerada.
 * @access  Privado (Entregador)
 */
router.get('/pendentes', autenticarEnvio, (req, res) => {
    const entregadorId = req.usuario.id;

    const sql = `
        SELECT
            e.id AS envio_id,
            e.wb
        FROM envios e
        WHERE e.entregador_id = ?
        AND e.fatura_gerada = FALSE
        ORDER BY e.data_envio ASC;
    `;

    dbEntregador.query(sql, [entregadorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar envios pendentes de fatura:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar envios pendentes.' });
        }
        res.json(results);
    });
});

/**
 * @route   POST /api/dhl/criar-fatura
 * @desc    Cria uma nova fatura, associa os envios selecionados e os marca como faturados.
 * @access  Privado (Entregador)
 */
router.post('/criar-fatura', autenticarEnvio, (req, res) => {
    const entregadorId = req.usuario.id;
    const { codigo_fatura, valor_total, data_vencimento, envios_selecionados } = req.body;

    // --- Validação ---
    if (!codigo_fatura || !valor_total || !data_vencimento || !envios_selecionados || envios_selecionados.length === 0) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios e ao menos um envio deve ser selecionado.' });
    }

    // --- Transação no Banco de Dados (ESSENCIAL!) ---
    dbEntregador.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão do pool:', err);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }

        connection.beginTransaction(async (err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: 'Erro ao iniciar transação.' });
            }

            try {
                // 1. Inserir na tabela 'faturas_dhl'
                const sqlInsertFatura = 'INSERT INTO faturas_dhl (codigo_fatura, valor_total, data_vencimento) VALUES (?, ?, ?)';
                const [resultFatura] = await connection.promise().query(sqlInsertFatura, [codigo_fatura, valor_total, data_vencimento]);
                const novaFaturaId = resultFatura.insertId;

                // 2. Inserir na tabela 'itens_fatura_dhl'
                const sqlInsertItens = 'INSERT INTO itens_fatura_dhl (fatura_id, envio_id) VALUES ?';
                const valuesItens = envios_selecionados.map(envioId => [novaFaturaId, envioId]);
                await connection.promise().query(sqlInsertItens, [valuesItens]);

                // 3. Atualizar a flag 'fatura_gerada' na tabela 'envios'
                const sqlUpdateEnvios = 'UPDATE envios SET fatura_gerada = TRUE WHERE id IN (?)';
                await connection.promise().query(sqlUpdateEnvios, [envios_selecionados]);

                // 4. Commit da Transação
                await connection.promise().commit();
                connection.release();
                console.log('Fatura criada com sucesso pelo entregador ID: ', entregadorId, { codigo_fatura, valor_total, data_vencimento, envios_selecionados });
                res.status(201).json({ message: 'Fatura criada com sucesso!' });

            } catch (error) {
                console.error('Erro na transação de criação de fatura:', error);
                await connection.promise().rollback();
                connection.release();
                res.status(500).json({ error: 'Falha ao criar a fatura. A operação foi revertida.' });
            }
        });
    });
});

module.exports = router;
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
 * @desc    Cria uma nova fatura, associa os envios, atualiza o frete em BRL e marca como faturado.
 * @access  Privado (Entregador)
 */
router.post('/criar-fatura', autenticarEnvio, async (req, res) => {
    // Agora recebemos também os valores_brl
    const { codigo_fatura, valor_total, data_vencimento, envios_selecionados, valores_brl } = req.body;

    // --- Validação Aprimorada ---
    if (!codigo_fatura || !valor_total || !data_vencimento || !envios_selecionados || envios_selecionados.length === 0 || !valores_brl) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios e ao menos um envio deve ser selecionado.' });
    }
    // Validação de consistência: o número de envios selecionados deve ser igual ao número de valores BRL enviados.
    if (envios_selecionados.length !== valores_brl.length) {
        return res.status(400).json({ error: 'Inconsistência de dados: o número de envios não bate com o número de valores detalhados.' });
    }

    // --- Transação no Banco de Dados ---
    const connection = await dbEntregador.promise().getConnection(); // Usando promise() para async/await

    try {
        await connection.beginTransaction();

        // 1. Inserir na tabela 'faturas_dhl'
        const sqlInsertFatura = 'INSERT INTO faturas_dhl (codigo_fatura, valor_total, data_vencimento) VALUES (?, ?, ?)';
        const [resultFatura] = await connection.query(sqlInsertFatura, [codigo_fatura, valor_total, data_vencimento]);
        const novaFaturaId = resultFatura.insertId;

        // 2. Inserir na tabela 'itens_fatura_dhl'
        const sqlInsertItens = 'INSERT INTO itens_fatura_dhl (fatura_id, envio_id) VALUES ?';
        const valuesItens = envios_selecionados.map(envioId => [novaFaturaId, envioId]);
        await connection.query(sqlInsertItens, [valuesItens]);

        // 3. ATUALIZAÇÃO MÁGICA: Atualizar 'fatura_gerada' e 'frete_final_brl' em uma única query!
        // Vamos construir uma query UPDATE com CASE para atualizar múltiplos envios com valores diferentes.
        
        let caseClauses = '';
        const updateParams = [];
        
        valores_brl.forEach(item => {
            caseClauses += 'WHEN ? THEN ? ';
            updateParams.push(item.envio_id, item.valor_brl);
        });

        const sqlUpdateEnvios = `
            UPDATE envios
            SET
                fatura_gerada = TRUE,
                frete_final_brl = CASE id ${caseClauses} END
            WHERE id IN (?)
        `;
        
        // O último parâmetro é o array de IDs para a cláusula IN
        const finalUpdateParams = [...updateParams, envios_selecionados];

        await connection.query(sqlUpdateEnvios, finalUpdateParams);

        // 4. Commit da Transação
        await connection.commit();
        res.status(201).json({ message: 'Fatura criada e envios atualizados com sucesso!' });

    } catch (error) {
        console.error('Erro na transação de criação de fatura:', error);
        await connection.rollback(); // Desfaz tudo em caso de erro
        res.status(500).json({ error: 'Falha ao criar a fatura. A operação foi revertida.' });
    } finally {
        if (connection) connection.release(); // Libera a conexão de volta para o pool
    }
});

/**
 * @route   GET /api/dhl-faturas/listar
 * @desc    Lista as faturas do entregador com paginação.
 * @access  Privado (Entregador)
 */
router.get('/listar', autenticarEnvio, async (req, res) => {
    const entregadorId = req.usuario.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // 10 faturas por página
    const offset = (page - 1) * limit;

    try {
        // Query para buscar a página atual de faturas
        const sqlFaturas = `
            SELECT
                f.id,
                f.codigo_fatura,
                f.valor_total,
                f.data_vencimento,
                f.paga,
                GROUP_CONCAT(e.wb SEPARATOR ', ') AS waybills
            FROM faturas_dhl f
            JOIN itens_fatura_dhl ifd ON f.id = ifd.fatura_id
            JOIN envios e ON ifd.envio_id = e.id
            WHERE f.id IN (
                SELECT DISTINCT fatura_id
                FROM itens_fatura_dhl ifd_sub
                JOIN envios e_sub ON ifd_sub.envio_id = e_sub.id
                WHERE e_sub.entregador_id = ?
            )
            GROUP BY f.id
            ORDER BY f.data_criacao DESC
            LIMIT ? OFFSET ?;
        `;

        // Query para contar o total de faturas (para a paginação)
        const sqlTotal = `
            SELECT COUNT(DISTINCT f.id) as total
            FROM faturas_dhl f
            JOIN itens_fatura_dhl ifd ON f.id = ifd.fatura_id
            JOIN envios e ON ifd.envio_id = e.id
            WHERE e.entregador_id = ?;
        `;

        // Executa as duas queries
        const [faturas] = await dbEntregador.promise().query(sqlFaturas, [entregadorId, limit, offset]);
        const [[{ total }]] = await dbEntregador.promise().query(sqlTotal, [entregadorId]);

        res.json({
            faturas,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });

    } catch (error) {
        console.error('Erro ao listar faturas:', error);
        res.status(500).json({ error: 'Erro interno ao buscar faturas.' });
    }
});

module.exports = router;
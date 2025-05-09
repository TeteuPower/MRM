const express = require('express');
const router = express.Router();
const { dbEntregador } = require('../../db'); // Importa a conexão com o banco de dados
const autenticarEnvio = require('../../middleware/authEnvio'); // Importa o middleware de autenticação
const uploadArquivosEnvio = require('../../middleware/firebase-config');
const multer = require('multer');

// --- Configuração do Multer para os Arquivos de Envio ---
// Armazenar em memória para enviar ao Firebase
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB por arquivo (ajuste se necessário)
});

// Middleware Multer para os dois campos de arquivo esperados no formulário
const handleUploads = upload.fields([
    { name: 'nota_fiscal', maxCount: 1 },
    { name: 'documentos_envio', maxCount: 1 }
]);

// --- Rotas da API para Envios ---

/**
 * @route   GET /api/envios/pendentes
 * @desc    Busca todos os pedidos com status 'Pronto, aguardando envio' com nomes de cliente/vendedor
 * @access  Privado (Entregador)
 */
router.get('/pendentes', autenticarEnvio, async (req, res) => {
    try {
        const sql = `
            SELECT
                p.id AS pedido_id,
                p.caixa_modelo,
                p.peso,
                p.vendedor_id,
                v.nome AS nome_vendedor,
                p.cliente_id,
                c.nome AS nome_cliente
            FROM pedidos p
            JOIN vendedores v ON p.vendedor_id = v.id
            JOIN clientes c ON p.cliente_id = c.id
            WHERE p.status = 'Pronto, aguardando envio'
            ORDER BY p.data_producao ASC;
        `;

        dbEntregador.query(sql, (err, results) => {
            if (err) {
                console.error('Erro ao buscar pedidos pendentes:', err);
                return res.status(500).json({ error: 'Erro interno ao buscar pedidos.' });
            }
            res.json(results);
        });

    } catch (error) {
        console.error('Erro inesperado em GET /pendentes:', error);
        res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

// API para obter um revendedor por ID
router.get('/:id', autenticarEnvio, (req, res) => {
    const revendedorId = req.params.id;
    const sql = 'SELECT id, nome FROM usuarios WHERE id = ? AND email_verificado = 1 AND entregador = TRUE';
    dbEntregador.query(sql, [revendedorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar entregador:', err);
            res.status(500).json({ error: 'Erro ao buscar entregador.' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Entregador não encontrado.' });
        }
    });
});

/**
 * @route   GET /api/envios/detalhes/:pedidoId
 * @desc    Busca detalhes de um pedido específico pendente, incluindo dados do cliente e arquivos existentes
 * @access  Privado (Entregador)
 */
router.get('/detalhes/:pedidoId', autenticarEnvio, async (req, res) => {
    const { pedidoId } = req.params;

    if (!pedidoId || isNaN(pedidoId)) {
        return res.status(400).json({ error: 'ID do pedido inválido.' });
    }

    try {
        const sql = `
            SELECT
                p.id AS pedido_id,
                p.caixa_modelo,
                p.peso,
                p.nota_fiscal,       -- URL da nota fiscal existente
                p.documentos_envio,  -- URL do documento de envio existente
                c.id AS cliente_id,
                c.nome AS nome_cliente,
                c.telefone AS telefone_cliente,
                c.email AS email_cliente,
                p.pais AS pais_cliente,
                c.endereco AS endereco_cliente,
                v.nome AS nome_vendedor
            FROM pedidos p
            JOIN clientes c ON p.cliente_id = c.id
            JOIN vendedores v ON p.vendedor_id = v.id
            WHERE p.id = ? AND p.status = 'Pronto, aguardando envio';
        `;

        dbEntregador.query(sql, [pedidoId], (err, results) => {
            if (err) {
                console.error(`Erro ao buscar detalhes do pedido ${pedidoId}:`, err);
                return res.status(500).json({ error: 'Erro interno ao buscar detalhes do pedido.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Pedido não encontrado ou já processado.' });
            }

            res.json(results[0]); // Retorna o objeto do pedido encontrado
        });

    } catch (error) {
        console.error(`Erro inesperado em GET /detalhes/${pedidoId}:`, error);
        res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});


/**
 * @route   POST /api/envios/confirmar
 * @desc    Confirma o envio, faz upload de arquivos (NF/Doc), insere na tabela 'envios' e atualiza 'pedidos'
 * @access  Privado (Entregador)
 */
router.post('/confirmar', autenticarEnvio, handleUploads, uploadArquivosEnvio, async (req, res) => {
    const entregadorId = req.usuario.id; // ID do entregador logado, vindo do middleware autenticarEnvio
    const {
        pedido_id,
        nome_cliente, // Note: Esses dados do cliente vêm do formulário preenchido pelo entregador
        telefone,
        email,
        pais,
        endereco,
        frete
    } = req.body;

    // --- Validação de Dados Essenciais ---
    if (!pedido_id || !nome_cliente || !telefone || !email || !pais || !endereco || frete === undefined || frete === null) {
        return res.status(400).json({ error: 'Todos os campos do formulário são obrigatórios (incluindo frete).' });
    }
    if (isNaN(parseFloat(frete)) || parseFloat(frete) < 0) {
         return res.status(400).json({ error: 'Valor do frete inválido.' });
    }

    // --- URLs dos arquivos ---
    // As URLs vêm do middleware uploadArquivosEnvio, que as anexa em req.firebaseUrls
    // O middleware também deve ter lidado com a lógica de usar URLs existentes se novos arquivos não foram enviados.
    const urlNotaFiscal = req.firebaseUrls?.nota_fiscal;
    const urlDocumentoEnvio = req.firebaseUrls?.documentos_envio;

    // Validação final dos arquivos (precisa ter ambos, seja novo ou existente)
    if (!urlNotaFiscal || !urlDocumentoEnvio) {
         console.warn(`Tentativa de confirmar envio do pedido ${pedido_id} sem NF ou Doc. NF: ${urlNotaFiscal}, Doc: ${urlDocumentoEnvio}`);
         return res.status(400).json({ error: 'É necessário fornecer ou já existir uma Nota Fiscal e um Documento de Envio.' });
    }

    // --- Transação no Banco de Dados ---
    dbEntregador.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão do pool:', err);
            return res.status(500).json({ error: 'Erro interno do servidor (conexão DB).' });
        }

        connection.beginTransaction(async (err) => {
            if (err) {
                connection.release();
                console.error('Erro ao iniciar transação:', err);
                return res.status(500).json({ error: 'Erro interno do servidor (transação).' });
            }

            try {
                // 1. Inserir na tabela 'envios'
                const sqlInsertEnvio = `
                    INSERT INTO envios (pedido_id, entregador_id, nome_cliente, frete, pais, endereco, telefone, email, data_envio)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                `;
                const valuesInsertEnvio = [pedido_id, entregadorId, nome_cliente, parseFloat(frete), pais, endereco, telefone, email];

                await new Promise((resolve, reject) => {
                    connection.query(sqlInsertEnvio, valuesInsertEnvio, (err, result) => {
                        if (err) return reject(err);
                        if (result.affectedRows === 0) return reject(new Error('Falha ao inserir na tabela envios.'));
                        //console.log(`Envio para pedido ${pedido_id} inserido com ID: ${result.insertId}`);
                        resolve(result);
                    });
                });

                // 2. Atualizar a tabela 'pedidos'
                const sqlUpdatePedido = `
                    UPDATE pedidos
                    SET
                        status = 'Finalizado',
                        valor_frete = ?,
                        data_finalizacao = NOW(),
                        nota_fiscal = ?,
                        documentos_envio = ?
                    WHERE id = ? AND status = 'Pronto, aguardando envio' -- Condição crucial
                `;
                const valuesUpdatePedido = [parseFloat(frete), urlNotaFiscal, urlDocumentoEnvio, pedido_id];

                const updateResult = await new Promise((resolve, reject) => {
                    connection.query(sqlUpdatePedido, valuesUpdatePedido, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });

                // Verificar se o pedido foi realmente atualizado (se ainda estava 'Pronto, aguardando envio')
                if (updateResult.affectedRows === 0) {
                    throw new Error('Pedido não encontrado no estado correto ou já finalizado por outro processo.');
                }
                 //console.log(`Pedido ${pedido_id} atualizado para Finalizado.`);

                // 3. Commit da Transação
                connection.commit((err) => {
                    if (err) {
                        console.error('Erro ao commitar transação:', err);
                        // Tentar rollback em caso de erro no commit
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ error: 'Erro ao finalizar a operação.' });
                        });
                    }

                    // Sucesso!
                    connection.release();
                    console.log(`Envio do pedido ${pedido_id} confirmado com sucesso pelo entregador ${entregadorId}.`);
                    res.status(200).json({ message: 'Envio confirmado e pedido finalizado com sucesso!' });
                });

            } catch (error) {
                // Erro em alguma das queries ou validação
                console.error(`Erro na transação de confirmação do pedido ${pedido_id}:`, error.message);
                connection.rollback(() => {
                    connection.release();
                    // Se o erro foi por status inválido, retornar 409 Conflict ou 404
                    if (error.message.includes('estado correto')) {
                         return res.status(409).json({ error: 'O pedido não está mais aguardando envio ou já foi processado.' });
                    }
                    // Outros erros
                    res.status(500).json({ error: 'Erro ao processar o envio.', details: error.message });
                });
            }
        }); // Fim connection.beginTransaction
    }); // Fim dbEntregador.getConnection
});

module.exports = router;
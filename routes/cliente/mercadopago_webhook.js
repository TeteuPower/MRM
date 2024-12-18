const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const {dbClientes} = require('../../db')
const { MercadoPagoConfig, Preference } = require('mercadopago');
const crypto = require('crypto');
//const axios = require('axios');
require('dotenv').config();

router.post('/notificacao', async (req, res) => {
try {
    const pagamento = req.body    
    const pagamentoId = pagamento.data?.id; // Usando Optional Chaining (?.) para evitar o erro

    if (!pagamentoId) {
        console.warn("Recebido notificação do Mercado Pago sem ID de pagamento.");
        return res.status(200).json({ message: 'Webhook recebido (sem ID de pagamento).' }); // Retorna 200 OK, mesmo sem processar
    } else {
        console.log(`Notificação '${pagamento.action}' recebida do pagamento '${pagamentoId}'.`);
        //Retornando status de mensagem recebida
        res.status(200).json({ message: 'Webhook recebido com sucesso!' });
    };

    //console.log('Notificação: ', pagamento);
    //console.log('Headers: ', req.headers);

    const assinaturaHeader = req.headers['x-signature'];
    const requestId = req.headers['x-request-id'];

    if (!assinaturaHeader) {
        console.error("Assinatura de segurança ausente no cabeçalho.");
        return res.status(400).send("Assinatura ausente. Que falta de educação!😜");
    }
      
    const [tsParte, v1Parte] = assinaturaHeader.split(',');
      
    if (!tsParte || !v1Parte) {
        console.error("Formato inválido da assinatura de segurança no cabeçalho da notificação.");
        return res.status(400).send("Dados de assinatura inválidos. Isso não me cheira bem...🤔");
    }

    const timestamp = tsParte.split('=')[1];
    const assinaturaRecebida = v1Parte.split('=')[1];

    if (!timestamp || !assinaturaRecebida) {
        console.error("Timestamp ou assinatura inválidos no cabeçalho x-hook-signature.");
        return res.status(400).send("Dados de assinatura inválidos.");
    }

    const idNotificacao = pagamento.id;

    
    let signatureTemplate = `id=${parseInt(idNotificacao)};ts=${parseInt(timestamp)}`;
    if (requestId) signatureTemplate += `;request-id=${requestId}`;
    //console.log(`Id Notificação: ${idNotificacao}; request-id: ${requestId}; ts: ${timestamp}`);
    //console.log(`Signature: ${signatureTemplate}`);
    
    // Calculando assinatura usando o timestamp e a chave secreta
    const assinaturaCalculada = crypto
    .createHmac('sha256', process.env.TOKEN_WEBHOOK_MERCADOPAGO)
    .update(signatureTemplate).digest('hex');
    //console.log('Assinatura calculada: ',assinaturaCalculada);
    //console.log('Assinatura recebida', assinaturaRecebida);
    
    // Verificando assinatura recebida com a assinatura calculada
    /*if (assinaturaCalculada !== assinaturaRecebida) {
        console.error("Assinatura inválida. Alguém anda tentando nos enganar!😈");
        return res.status(400).send("Assinatura inválida.");
    }*/

    //console.log('Assinatura válida.');

    try {
    //Consultando api do mercado Pago com o id do pagamento para conferir o status https://api.mercadopago.com/v1/payments/${pagamentoId}
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${pagamentoId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN_MERCADOPAGO}`
        }
    });
    // Verificando o status da resposta da API do Mercado Pago
    if (!response.ok) {
        const errorData = await response.json(); // Tenta obter detalhes do erro da resposta
        if (errorData.message === 'Payment not found') {
            console.error(`Pagamento ${pagamentoId} não encontrado na API do Mercado Pago`)
            return res.status(200).json({ message: 'Pagamento não encontrado.' }); // Retorna 200 OK, mesmo sem processar
        } else {
            console.error("Erro ao consultar a API do Mercado Pago:", response.status, errorData);
            throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
        }
    }

        const data = await response.json();
        //console.log(data);
        // Verificando se os campos necessários existem na resposta
        if (!data.status || !data.id) {
            console.error("Dados incompletos na resposta da API do Mercado Pago:", data);
            throw new Error("Resposta da API do Mercado Pago incompleta.");
        }
        const externalReference = JSON.parse(data.external_reference);
        //console.log(externalReference);
        const status = data.status;
        const pedidoId = externalReference.pedidoId;
        const usuarioId = externalReference.usuarioId;
        const pedidoValor = externalReference.valor;

        if (!pedidoId) {
            console.error("ID do pagamento não encontrado no externalReference do pedido:", data);
            throw new Error("ID do pagamento não encontrado no externalReference do pedido");
        }

        try{
            //Atualizando o status do pedido no banco de dados
            await dbClientes.promise().query('UPDATE pedidos_usuarios SET status = ? WHERE id = ?', [status, pedidoId]);
        } catch (error) {
            console.error("Erro ao atualizar status do pedido no DB:", error);
            throw new Error("Erro ao atualizar o status do pedido no banco de dados.");
        }

    if (status === 'approved') {

        //Capturando itens do pedido no banco de dados
        try {
            //console.log('Id do pedido: ', id);
            dbClientes.promise().query('SELECT * FROM itens_pedido_usuario WHERE pedido_id = ?', [pedidoId])
            .then(async ([rows, fields]) => {
                const itensDoPedido = rows;
                //console.log(itensDoPedido);
                //Atualizando quantidade do produto no estoque
                for (let i = 0; i < itensDoPedido.length; i++) {
                    await dbClientes.promise().query('UPDATE produtos_site SET quantidade = quantidade - ? WHERE id = ?',
                        [itensDoPedido[i].quantidade, itensDoPedido[i].produto_id]);
                    console.log(`Produto id: ${itensDoPedido[i].produto_id} reduzida quantidade de ${itensDoPedido[i].quantidade} do estoque`);

                    //Verificando a quantidade do produto
                    const produto = await dbClientes.promise().query('SELECT quantidade FROM produtos_site WHERE id =?', [itensDoPedido[i].produto_id]);
                    //console.log('Quantidade do produto:', produto[0][0].quantidade);

                    //Desativando o produto se a quantidade for igual ou menor a 0
                    if (produto[0][0].quantidade <= 0) {
                        await dbClientes.promise().query('UPDATE produtos_site SET status = 0 WHERE id =?', [itensDoPedido[i].produto_id]);
                        console.log(`Produto id: ${itensDoPedido[i].produto_id} desativado`);
                    }
                }
            })
            .catch(err => {
                console.error('Erro ao buscar itens do pedido:', err);
            });
        } catch (error) {
            console.error("Erro ao atualizar no DB:", error);
            throw new Error("Erro ao atualizar a quantidade do produto no estoque.");
        }
    }

    console.log(`Pedido Nº${pedidoId} alterou status de pagamento para ${status}`);


    //Enviando email de pagamento recebido quando status de pagamento for "approved"
    if (status === 'approved') {
        try {
            const sql = 'SELECT email FROM usuarios WHERE id = ?';
            const [result] = await dbClientes.promise().query(sql, [usuarioId]);
            const email = result[0].email;
            const apiUrl = process.env.API_URL;
            // Envia o email e o token para api de enviar email
            console.log(`Email: ${email}, Pedido: ${pedidoId}, Valor R$: ${pedidoValor} ${status}`);
            const response = await fetch(`${apiUrl}/api/usuarios/pagamento-confirmado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, pedidoId, pedidoValor })
            });
            if (!response.ok) {
                throw new Error('Erro ao enviar email de confirmação de pagamento.');
            }
        } catch (error) {
            console.error('Erro ao enviar email de pagamento recebido:', error);
            throw new Error('Erro ao enviar email de pagamento recebido.');
        }

        //Enviando email de aviso de nova venda para administração
        try {
            const apiUrl = process.env.API_URL;
            const response = await fetch(`${apiUrl}/api/email-pagamento-confirmado-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pedidoId, pedidoValor })
            });
            if (!response.ok) {
                throw new Error('Erro ao enviar email de confirmação de pagamento à administração.');
            }
        } catch (error) {
            console.error('Erro ao enviar email de pagamento recebido para administração:', error);
            throw new Error('Erro ao enviar email de pagamento recebido para administração.');
        }
    }
    } catch (error) {
        console.error("Erro ao processar notificação do Mercado Pago:", error);
        res.status(500).json({ error: 'Erro ao processar notificação do Mercado Pago.' });
    }
} catch (error) {
    console.error("Erro ao processar o webhook:", error);
    res.status(500).json({ error: 'Erro ao processar o webhook.' });
}


});

router.get('/notificacao', async (req, res) => {
    try {
        const pagamento = req.query;
        const payment_id = pagamento.payment_id;
        //console.log('Redirecionar cliente: ', 'Pagamento: ', pagamento, 'Payment_id: ', payment_id);
        try {
            //Consultando api do mercado Pago com o id do pagamento para conferir o status https://api.mercadopago.com/v1/payments/${pagamentoId}
            const response = fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.ACCESS_TOKEN_MERCADOPAGO}`
                }
            });
            // Verificando o status da resposta da API do Mercado Pago
            if (!response.ok) {
                const errorData = await response.json(); // Tenta obter detalhes do erro da resposta
                console.error("Erro ao consultar a API do Mercado Pago:", response.status, errorData);
                throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
            }

            const data = await response.json();
            const status = data.status;
            //const id = data.external_reference;
            //console.log('AAAAAA')

            let redirectUrl;

            if (status === 'approved') {
                redirectUrl = '/pagamento-aprovado';
            } else if (status ==='pending'){
                redirectUrl = `/aguardando-pagamento?payment_id=${payment_id}`;
            }
            
            else {
                redirectUrl = '/pagamento-rejeitado';
            }

            res.status(200).json({ redirectUrl }); // Enviando a URL como JSON

        }
        catch (error) {
            console.error("Erro ao processar notificação do Mercado Pago:", error);
            res.status(500).json({ error: 'Erro ao processar notificação do Mercado Pago.' });
        }


    } catch (error) {
        console.error("Erro no webhook (GET):", error);
        res.status(500).json({ error: "Erro no processamento." }); // Respondendo com erro em formato JSON
    }
});

module.exports = router;
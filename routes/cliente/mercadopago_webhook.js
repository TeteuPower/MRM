const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const {dbClientes} = require('../../db')
const { MercadoPagoConfig, Preference } = require('mercadopago');
//const axios = require('axios');
require('dotenv').config();

router.post('/notificacao', async (req, res) => {
try {
    const pagamento = req.body
    const pagamentoId = pagamento.data.id;

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
        console.error("Erro ao consultar a API do Mercado Pago:", response.status, errorData);
        throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
    }

    const data = await response.json();
    // Verificando se os campos necessários existem na resposta
    if (!data.status || !data.collector_id) {
        console.error("Dados incompletos na resposta da API do Mercado Pago:", data);
        throw new Error("Resposta da API do Mercado Pago incompleta.");
    }
    const status = data.status;
    const collector_id = data.collector_id;

        try{
            //Atualizando o status do pedido no banco de dados
            await dbClientes.promise().query('UPDATE pedidos_usuarios SET status = ? WHERE collector_id = ?', [status, collector_id]);
        } catch (error) {
            console.error("Erro ao atualizar no DB:", error);
            throw new Error("Erro ao atualizar o status do pedido no banco de dados.");
        }


    //Retornando status de mensagem recebida
    res.status(200).json({ message: 'Webhook recebido com sucesso!' });

    } catch (error) {
        console.error("Erro ao processar notificação do Mercado Pago:", error);
        res.status(500).json({ error: 'Erro ao processar notificação do Mercado Pago.' });
    }

} catch (error) {
    console.error("Erro ao processar o webhook:", error);
    res.status(500).json({ error: 'Erro ao processar o webhook.' });
}


});

module.exports = router;
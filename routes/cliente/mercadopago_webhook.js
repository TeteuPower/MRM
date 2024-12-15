const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const {dbClientes} = require('../../db')
const { MercadoPagoConfig, Preference } = require('mercadopago');
//const axios = require('axios');
require('dotenv').config();

router.post('/notificacao', async (req, res) => {
    const pagamento = req.body
    const pagamentoId = pagamento.data.id;

    //Consultando api do mercado Pago com o id do pagamento para conferir o status https://api.mercadopago.com/v1/payments/${pagamentoId}
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${pagamentoId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN_MERCADOPAGO}`
        }
    });

    const data = await response.json();
    const status = data.status;
    const collector_id = data.collector_id;

    //Atualizando o status do pedido no banco de dados
    await dbClientes.promise().query('UPDATE pedidos_usuarios SET status = ? WHERE collector_id = ?', [status, collector_id]);

    //Retornando status de mensagem recebida
    res.status(200).json({ message: 'Webhook recebido com sucesso!' });


});

module.exports = router;
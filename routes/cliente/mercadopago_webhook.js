const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const {dbClientes} = require('../../db')
const { MercadoPagoConfig, Preference } = require('mercadopago');
//const axios = require('axios');
require('dotenv').config();

router.post('/notificacao', async (req, res) => {
    const pagamento = req.body
    // Pegando id do pagamento
    const pagamentoId = pagamento.data.id;
    //Definindo req.body como json
    //req.body = JSON.parse(req.body);
    console.log('id do pagamento recebido pelo webhook: ',pagamentoId);

    //Consultando api do mercado Pago com o id do pagamento para conferir o status https://api.mercadopago.com/v1/payments/${pagamentoId}
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${pagamentoId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN_MERCADOPAGO}`
        }
    });

    const data = await response.json();
    //console.log(data);
    console.log('Resultado da consulta feita no payments do mercadopago depois de receber o webhook: ',data);
    const status = data.status;
    const collector_id = data.collector_id;
    console.log('Status do pagamento: ',status);
    //const id_pedido = data.metadata.id_pedido;
    //console.log(id_pedido);

    //Atualizando o status do pedido no banco de dados
    await dbClientes.promise().query('UPDATE pedidos_usuarios SET status = ? WHERE collector_id = ?', [status, collector_id]);

    //Retornando status de mensagem recebida
    res.status(200).json({ message: 'Mensagem recebida com sucesso!' });


});

module.exports = router;
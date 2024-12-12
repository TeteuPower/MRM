const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const {dbClientes} = require('../../db')
const { MercadoPagoConfig, Preference } = require('mercadopago');
//const axios = require('axios');
require('dotenv').config();

router.post('/notificacao', async (req, res) => {
    //Definindo req.body como json
    req.body = JSON.parse(req.body);
    console.log(req.body);
    //console.log(req.body.id);
    //const id_pedido = req.body.id;
});

module.exports = router;
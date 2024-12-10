const express = require('express');
const router = express.Router();
const {dbClientes} = require('../db')
const jwt = require('jsonwebtoken');
const autenticarClientes = require('../middleware/authClientes');

router.post('/notificacoes', (req, res) => {
    const { body } = req;
    return console.log(body);
});






module.exports = router;
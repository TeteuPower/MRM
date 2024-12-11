const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

//Rota que cria novo pagamento
router.post('/', autenticarClientes, (req, res) => {
  const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN_MERCADOPAGO });

  const preference = new Preference(client);

  preference.create({
    body: {
      items: [
        {
          id: '1',
          title: 'Rapé',
          quantity: 1,
          unit_price: 500
        }
      ],
      back_urls: { // Adicionando URLs de retorno (importantes!)
        success: "URL_DE_SUCESSO",
        failure: "URL_DE_FALHA",
        pending: "URL_DE_PENDENCIA"
      }

    }
  })
  .then(result => {
    console.log("Preferência criada com sucesso:");
    console.log(result); // Exibe o ID da preferência
    console.log(result.init_point); // Exibe o link da preferência
  })
  .catch(error => {
    console.error("Erro ao criar preferência:");
    console.error(error);
  });
});


module.exports = router;
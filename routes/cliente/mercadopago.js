const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const {dbClientes} = require('../../db')
const { MercadoPagoConfig, Preference } = require('mercadopago');
//const axios = require('axios');
require('dotenv').config();

//Rota que cria novo pagamento
router.post('/', autenticarClientes, async (req, res) => {
  const usuarioId = req.usuario.id;
  const pedido = req.body;
  //console.log('Todos os dados do pedido: ', pedido)
  //console.log('Id do usuario: ',usuarioId);
  //console.log('Id do endereço: ',pedido.endereco_id);

  //Consulta a tabela enderecos e busca o endereço se o usuario_id for igual ao usuarioId
  const endereco = await dbClientes.promise().query('SELECT * FROM enderecos WHERE id = ? AND usuario_id = ?', [pedido.endereco_id, usuarioId]);
  //console.log('Endereço do pedido: ',endereco[0]);
  //Consulta a tabela usuarios e busca dados do usuario
  const usuario = await dbClientes.promise().query('SELECT nome, email, telefone, sobrenome, cpf FROM usuarios WHERE id = ?', [usuarioId]);
  //console.log('Dados do usuario: ',usuario[0]);
  //Consulta a tabela cupons e verifica o desconto
  const cupom = await dbClientes.promise().query('SELECT desconto, ativo FROM cupons WHERE codigo = ?', [pedido.cupom]);
  console.log('Cupom: ',cupom[0]);

  //itera sobre cada produto no pedido.produtos, consulta a tabela produtos e resgata o preco através do id e multiplica pela quantity do produto
  let total = 0;
  for (let i = 0; i < pedido.produtos.length; i++) {
    const produto = await dbClientes.promise().query('SELECT preco FROM produtos WHERE id = ?', [pedido.produtos[i].productId]);
    total += produto[0][0].preco * pedido.produtos[i].quantity;
    console.log('Id do produto: ',pedido.produtos[i].productId,'Quantidade: ', pedido.produtos[i].quantity,'Preço: ', produto[0][0].preco);
  }
  if (cupom[0].length > 0) {
    if (cupom[0][0].ativo == '1') {
      total = total * (1 - (cupom[0][0].desconto/100));
    } else {
      console.log('Cupom não ativo');
    }
  } else {
    console.log('Cupom não encontrado');
  }

  console.log('Total: ',total);

  return;
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
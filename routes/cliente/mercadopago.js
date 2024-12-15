const express = require('express');
const router = express.Router();
const autenticarClientes = require('../../middleware/authClientes'); // Importa o middleware de autenticação
const {dbClientes} = require('../../db')
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

//Rota que cria novo pagamento
router.post('/', autenticarClientes, async (req, res) => {
  const usuarioId = req.usuario.id;
  const pedido = req.body;

  //Consulta a tabela enderecos e busca o endereço se o usuario_id for igual ao usuarioId
  const endereco = await dbClientes.promise().query('SELECT * FROM enderecos WHERE id = ? AND usuario_id = ?', [pedido.endereco_id, usuarioId]);
  if (!endereco[0].length) {
    return res.status(404).json({ error: 'Endereço de entrega não encontrado.' });
  };

  //Consulta a tabela usuarios e busca dados do usuario
  const usuario = await dbClientes.promise().query('SELECT nome, email, telefone, sobrenome, cpf FROM usuarios WHERE id = ?', [usuarioId]);
  if (!usuario[0].length) {
    return res.status(404).json({ error: 'Usuário de entrega não encontrado.' });
  }

  //Consulta a tabela cupons e verifica o desconto
  const cupom = await dbClientes.promise().query('SELECT desconto, ativo FROM cupons WHERE codigo = ?', [pedido.cupom]);


  //itera sobre cada produto no pedido.produtos, consulta a tabela produtos e resgata o preco através do id e multiplica pela quantity do produto
  try {
    let total = 0;
    const produtosParaMercadoPago = [];
    for (let i = 0; i < pedido.produtos.length; i++) {
      const produto = await dbClientes.promise().query('SELECT preco, nome FROM produtos WHERE id = ?', [pedido.produtos[i].productId]);
      total += produto[0][0].preco * pedido.produtos[i].quantity;
      //console.log('Id do produto: ',pedido.produtos[i].productId,'Quantidade: ', pedido.produtos[i].quantity,'Preço: ', produto[0][0].preco);
      //console.log(produto[0][0].nome);

      produtosParaMercadoPago.push({ // Adiciona o item ao array
        id: pedido.produtos[i].productId, // Usando o ID do produto como ID do item.
        title: produto[0][0].nome, // Nome do produto
        quantity: pedido.produtos[i].quantity,
        unit_price: parseFloat(produto[0][0].preco),
        currency_id: 'BRL',
        //picture_url: imagemProduto // URL da imagem do produto
      });


    }
    //console.log(produtosParaMercadoPago);
    let desconto = 0;
    if (cupom[0].length > 0) {
      if (cupom[0][0].ativo == '1') {
        const totalComDesconto = total * (1 - (cupom[0][0].desconto/100));
        desconto = total - totalComDesconto;
        total = totalComDesconto;
        //console.log('Desconto: ',desconto);
        produtosParaMercadoPago.push({
          id: 'desconto', // Um ID para o item de desconto
          title: 'Desconto do cupom',
          quantity: 1,
          unit_price: -desconto, // Valor negativo para representar desconto
          currency_id: 'BRL'
        });
      } else {
        console.log('Cupom não ativo');
      }
    } else {
      console.log('Cupom não encontrado');
    }

    //console.log('Total: ',total);

    //console.log(produtosParaMercadoPago);


    const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN_MERCADOPAGO });

    const preference = new Preference(client);

    preference.create({
      body: {
        items: produtosParaMercadoPago,
        payer: {
          name: usuario[0][0].nome,
          surname: usuario[0][0].sobrenome,
          email: usuario[0][0].email,
          phone: {
            area_code: `${(usuario[0][0].telefone).slice(0, 2)}`,
            number: `${(usuario[0][0].telefone).slice(2)}`
          },
          identification: {
            type: 'CPF',
            number: usuario[0][0].cpf
          }
        },
        address: {
          zip_code: endereco[0][0].cep,
          street_name: endereco[0][0].endereco,
          street_number: endereco[0][0].numero
        },
        back_urls: { // Adicionando URLs de retorno (importantes!)
          success: `${process.env.API_URL}/api/webhook/mercadopago/notificacao`,
          failure: `${process.env.API_URL}/api/webhook/mercadopago/notificacao`,
          pending: `${process.env.API_URL}/api/webhook/mercadopago/notificacao`
        },
        auto_return: 'all',
        external_reference: 666,

      }
    })
    .then(async result => {

      console.log('Resultado da preferência após gerar um novo pedido: ', result);
      //Adiciona os dados da venda na tabela pedidos_usuarios
      await dbClientes.promise().query
      ('INSERT INTO pedidos_usuarios (usuario_id, vendedor_id, moeda, valor_venda, valor_frete, status, data_criacao, endereco_id, preference_id, client_id, collector_id, cupom) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', 
      [usuarioId, 1, 'BRL', total, 0, 'pendente', new Date(), pedido.endereco_id, result.id, result.client_id, result.collector_id, pedido.cupom]);
      const pedidoId = await dbClientes.promise().query('SELECT MAX(id) as id FROM pedidos_usuarios WHERE usuario_id =?', [usuarioId]);
      //console.log('Pedido ID: ', pedidoId[0][0].id);

      //Adiciona os dados dos itens do pedido na tabela itens_pedido_usuario
      for (let i = 0; i < pedido.produtos.length; i++) {
        await dbClientes.promise().query
        ('INSERT INTO itens_pedido_usuario (pedido_id, produto_id, quantidade, produto, tipo_rape) VALUES (?,?,?,?,?)', 
        [pedidoId[0][0].id, pedido.produtos[i].productId, pedido.produtos[i].quantity, 'produto[0][0].nome', 'tipo_rape']);
        //console.log('Produto: ', pedido.produtos[i])
      }
      res.status(200).json({
        message: 'Pedido criado com sucesso',
        pedidoId: pedidoId[0][0].id,
        init_point: result.init_point,
      });

      //console.log('Gerado novo Pedido: ', result.init_point); // Exibe o link da preferência
    })
    .catch(error => {
      console.error("Erro ao salvar pedido no DB:");
      console.error(error);
    });

  } catch (error) {
    console.error("Erro ao criar preferência:");
    console.log(error);
  }


});


module.exports = router;
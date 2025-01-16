const express = require('express');
const router = express.Router();
const { db } = require('../../db');
const autenticar = require('../../middleware/auth');

// Rota para obter um pedido por ID (GET /api/pedidos/:id)
router.get('/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const sql = 'SELECT * FROM pedidos WHERE id = ?';
  
    db.query(sql, [pedidoId], (err, results) => {
      if (err) {
        console.error('Erro ao buscar pedido:', err);
        return res.status(500).json({ error: 'Erro ao buscar pedido.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }
  
      const pedido = results[0];
  
      // Busca os itens do pedido
      const sqlItens = 'SELECT * FROM itens_pedido WHERE pedido_id = ?';
      db.query(sqlItens, [pedidoId], (err, itens) => {
        if (err) {
          console.error('Erro ao buscar itens do pedido:', err);
          return res.status(500).json({ error: 'Erro ao buscar pedido.' });
        }
  
        pedido.itens = itens;
  
        // Busca o nome do cliente
        const sqlCliente = 'SELECT nome FROM clientes WHERE id = ?';
        db.query(sqlCliente, [pedido.cliente_id], (err, cliente) => {
          if (err) {
            console.error('Erro ao buscar cliente:', err);
            return res.status(500).json({ error: 'Erro ao buscar pedido.' });
          }
  
          pedido.cliente = cliente[0].nome;
  
          // Busca o nome do vendedor
          const sqlVendedor = 'SELECT nome FROM vendedores WHERE id = ?';
          db.query(sqlVendedor, [pedido.vendedor_id], (err, vendedor) => {
            if (err) {
              console.error('Erro ao buscar vendedor:', err);
              return res.status(500).json({ error: 'Erro ao buscar pedido.' });
            }
  
            pedido.vendedor = vendedor[0].nome;
  
            // Busca o nome do administrador
            const sqlAdministrador = 'SELECT nome FROM administradores WHERE id = ?';
            db.query(sqlAdministrador, [pedido.administrador_id], (err, administrador) => {
              if (err) {
                console.error('Erro ao buscar administrador:', err);
                return res.status(500).json({ error: 'Erro ao buscar pedido.' });
              }
  
              pedido.administrador = administrador[0].nome;
  
              // Busca o nome do produtor (se existir)
              if (pedido.produtor_id) {
                const sqlProdutor = 'SELECT nome FROM produtores WHERE id = ?';
                db.query(sqlProdutor, [pedido.produtor_id], (err, produtor) => {
                  if (err) {
                    console.error('Erro ao buscar produtor:', err);
                    return res.status(500).json({ error: 'Erro ao buscar pedido.' });
                  }
  
                  pedido.produtor = produtor[0].nome;
                  return res.json(pedido);
                });
              } else {
                return res.json(pedido);
              }
            });
          });
        });
      });
    });
  });


// Rota para atualizar um pedido (PUT /api/pedidos/:id)
router.put('/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const { status, dataFinalizacao, valorFrete, produtor, repasseComissao, saldoVenda, itens, dataProducao } = req.body;

    // Verifica se o status foi fornecido
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório.' });
    }

    // Atualiza o pedido no banco de dados
    const sql = 'UPDATE pedidos SET status = ?, data_finalizacao = ?, valor_frete = ?, produtor_id = ?, repasse_comissao = ?, saldo_venda = ?, data_producao = ? WHERE id = ?';
    db.query(sql, [status, dataFinalizacao, valorFrete, produtor, repasseComissao === true ? 1 : 0, saldoVenda, dataProducao, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
            return;
        }

        if (result.affectedRows > 0) {
            // Atualiza os itens do pedido
            itens.forEach(item =>
            {
                const sqlItem = 'UPDATE itens_pedido SET lote = ? WHERE pedido_id = ? AND produto_id = ? AND id = ?';
                db.query(sqlItem, [item.lote, pedidoId, item.produto_id, item.id], (err, result) =>
                {
                    if (err)
                    {
                        console.error('Erro ao atualizar item do pedido:', err);
                        res.status(500).json({ error: 'Erro ao atualizar pedido.' });
                        return;
                    }
                })
            })
            res.json({ message: 'Pedido atualizado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Pedido não encontrado.' });
        }
    });
});

// Rota para EDITAR um pedido
router.put('/editar/:id', autenticar, (req, res) => {
  const pedidoId = req.params.id;
  const { cliente_id, vendedor_id, descricao, moeda, valor_venda, valor_pago, status, valor_frete, produtor_id, saldo_venda, itens, lucro_venda } = req.body;

  // Verifica se o status foi fornecido
  if (!status) {
      return res.status(400).json({ error: 'O status é obrigatório.' });
  }

  // Atualiza o pedido no banco de dados
  const sql = 'UPDATE pedidos SET cliente_id = ?, vendedor_id = ?, descricao = ?, moeda = ?, valor_venda = ?, valor_pago = ?, status = ?, valor_frete = ?, produtor_id = ?, saldo_venda = ?, lucro_venda = ? WHERE id = ?';
  db.query(sql, [cliente_id, vendedor_id, descricao, moeda, valor_venda, valor_pago, status, valor_frete, produtor_id, saldo_venda, lucro_venda, pedidoId], (err, result) => {
      if (err) {
          console.error('Erro ao atualizar pedido:', err);
          res.status(500).json({ error: 'Erro ao atualizar pedido.' });
          return;
      }

      /*if (result.affectedRows > 0) {
          // Atualiza os itens do pedido
          itens.forEach(item => {
              const sqlItem = 'UPDATE itens_pedido SET lote = ? WHERE pedido_id = ? AND produto_id = ?';
              db.query(sqlItem, [item.lote, pedidoId, item.produto_id], (err, result) => {
                  if (err) {
                      console.error('Erro ao atualizar item do pedido:', err);
                      res.status(500).json({ error: 'Erro ao atualizar pedido.' });
                      return;
                  }
              });
          });

          res.json({ message: 'Pedido atualizado com sucesso!' });
      } else {
          res.status(404).json({ error: 'Pedido não encontrado.' });
      }*/
          res.json({ message: 'Pedido atualizado com sucesso!' });
  });
});

// Rota para criar um novo pedido (POST /api/pedidos)
router.post('/', autenticar, (req, res) => {
    const { clienteId, dataCriacao, descricao, moeda, valorVenda, valorPago, status, administradorId, vendedorId, saldoVenda, itens, lucroVenda, valorInsumos} = req.body;
    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!clienteId || !dataCriacao || !moeda || !valorVenda || !administradorId || !vendedorId || !itens) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Insere o pedido no banco de dados
    const sql = 'INSERT INTO pedidos (cliente_id, data_criacao, descricao, moeda, status, valor_venda, valor_pago, administrador_id, vendedor_id, saldo_venda, lucro_venda, valor_insumos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [clienteId, dataCriacao, descricao, moeda, status, valorVenda, valorPago, administradorId, vendedorId, saldoVenda, lucroVenda, valorInsumos], (err, result) => {
        if (err) {
            console.error('Erro ao criar pedido:', err);
            res.status(500).json({ error: 'Erro ao criar pedido.' });
            return;
        }

        const pedidoId = result.insertId;

        // Insere os itens do pedido
        itens.forEach(item => {
            const sqlItem = 'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, lote, produto, tipo_rape) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(sqlItem, [pedidoId, item.produtoId, item.quantidade, item.lote, item.produto, item.tipoRape], (err, result) => {
                if (err) {
                    console.error('Erro ao inserir item do pedido:', err);
                    res.status(500).json({ error: 'Erro ao criar pedido.' });
                    return;
                }
            });
        });

        res.json({ message: 'Pedido criado com sucesso!', id: pedidoId });
    });
});

// Adicionar item pedido já existente
router.post('/adicionar-itens', autenticar, (req, res) => {
  const {pedido_id, produto_id, quantidade, lote, produto, tipo_rape} = req.body;

          const sqlItem = 'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, lote, produto, tipo_rape) VALUES (?, ?, ?, ?, ?, ?)';
          db.query(sqlItem, [pedido_id, produto_id, quantidade, lote, produto, tipo_rape], (err, result) => {
              if (err) {
                  console.error('Erro ao inserir item do pedido:', err);
                  res.status(500).json({ error: 'Erro ao criar pedido.' });
                  return;
              }
          });
      res.json({ message: 'Pedido alterado com sucesso!', id: pedido_id });
});

// Rota para obter os pedidos de um cliente (GET /api/pedidos/cliente/:id)
router.get('/cliente/:id', autenticar, (req, res) => {
    const clienteId = req.params.id;
    const sql = 'SELECT * FROM pedidos WHERE cliente_id = ?';
    db.query(sql, [clienteId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos do cliente:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos do cliente.' });
            return;
        }
        res.json(results);
    });
});

// Rota para obter os pedidos de um vendedor (GET /api/pedidos/vendedor/:id)
router.get('/vendedor/:id', autenticar, (req, res) => {
  const vendedorId = req.params.id;

  const sql = 'SELECT * FROM pedidos WHERE vendedor_id = ?';
  db.query(sql, [vendedorId], (err, pedidos) => {
    if (err) {
      console.error('Erro ao buscar pedidos do vendedor:', err);
      return res.status(500).json({ error: 'Erro ao buscar pedidos do vendedor.' });
    }

    // Para cada pedido, buscar o nome do cliente
    Promise.all(pedidos.map(pedido => {
      return new Promise((resolve, reject) => {
        const sqlNome = 'SELECT nome FROM clientes WHERE id = ?';
        db.query(sqlNome, [pedido.cliente_id], (err, result) => {
          if (err) {
            console.error('Erro ao buscar nome do cliente:', err);
            return reject(err); // Rejeita a promise se houver erro
          }
          // Adiciona o nome do cliente ao objeto do pedido
          pedido.cliente_nome = result[0].nome; 
          resolve(pedido); 
        });
      });
    }))
    .then(pedidosComNome => { 
      res.json(pedidosComNome);
    })
    .catch(err => {
      console.error('Erro ao processar pedidos:', err);
      res.status(500).json({ error: 'Erro ao processar pedidos.' });
    });
  });
});

// Rota para remover um item do pedido (DELETE /api/pedidos/:id/itens/:itemId)
router.delete('/itens/:itemId', autenticar, (req, res) => {
  //const pedidoId = req.params.id;
  const itemId = req.params.itemId;

  const sql = 'DELETE FROM itens_pedido WHERE id = ?';
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error('Erro ao remover item do pedido:', err);
      return res.status(500).json({ error: 'Erro ao remover item do pedido.' });
    }

    if (result.affectedRows > 0) {
      return res.json({ message: 'Item do pedido removido com sucesso!' });
    } else {
      return res.status(404).json({ error: 'Item do pedido não encontrado.' }); 
    }
  });
});

// Rota para cancelar um pedido (DELETE /api/pedidos/:id)
router.delete('/:id', autenticar, (req, res) => {
  const pedidoId = req.params.id;

  const sql = 'DELETE FROM pedidos WHERE id = ?';
  db.query(sql, [pedidoId], (err, result) => {
      if (err) {
          console.error('Erro ao cancelar pedido:', err);
          res.status(500).json({ error: 'Erro ao cancelar pedido.' });
          return;
      }

      if (result.affectedRows > 0) {
          res.json({ message: 'Pedido cancelado com sucesso!' });
      } else {
          res.status(404).json({ error: 'Pedido não encontrado.' });
      }
  });
});

module.exports = router;
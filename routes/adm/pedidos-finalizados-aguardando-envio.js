const express = require('express');
const router = express.Router();
const { db } = require('../../db');
const autenticar = require('../../middleware/auth');

// Rota para obter os pedidos finalizados aguardando envio (GET /api/pedidos/finalizados-aguardando-envio)
router.get('/', autenticar, (req, res) => {
      const sql = `
      SELECT 
          p.*,
          (
              SELECT SUM(ip.quantidade) 
              FROM itens_pedido ip 
              WHERE ip.pedido_id = p.id AND ip.produto_id = 1
          ) AS quantidade_rape_pacotes
      FROM 
          pedidos p
      WHERE 
          p.status IN ("Pronto, aguardando envio");
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Erro ao buscar pedidos finalizados aguardando envio:', err);
        res.status(500).json({ error: 'Erro ao buscar pedidos finalizados aguardando envio.' });
        return;
      }
  
      // Itera sobre cada pedido encontrado
      const pedidosCompletos = results.map(pedido => {
        return new Promise((resolve, reject) => {
          // Busca o nome do cliente
          const sqlCliente = 'SELECT nome FROM clientes WHERE id = ?';
          db.query(sqlCliente, [pedido.cliente_id], (err, cliente) => {
            if (err) {
              console.error('Erro ao buscar cliente:', err);
              reject('Erro ao buscar cliente.'); // Rejeita a promise em caso de erro
              return;
            }
  
            // Adiciona o nome do cliente ao objeto do pedido
            pedido.cliente = cliente[0].nome;
  
            // Busca o nome do vendedor
            const sqlVendedor = 'SELECT nome FROM vendedores WHERE id = ?';
            db.query(sqlVendedor, [pedido.vendedor_id], (err, vendedor) => {
              if (err) {
                console.error('Erro ao buscar vendedor:', err);
                reject('Erro ao buscar vendedor.'); // Rejeita a promise em caso de erro
                return;
              }
  
              // Adiciona o nome do vendedor ao objeto do pedido
              pedido.vendedor = vendedor[0].nome;
  
              resolve(pedido); // Resolve a promise com o pedido completo
            });
          });
        });
      });
  
      // Aguarda todas as promises serem resolvidas
      Promise.all(pedidosCompletos)
        .then(pedidos => {
          res.json(pedidos); // Envia os pedidos completos como resposta
        })
        .catch(err => {
          console.error('Erro ao buscar informações do pedido:', err);
          res.status(500).json({ error: 'Erro ao buscar informações do pedido.' });
        });
    });
  });

// Rota para atualizar um pedido (PUT /api/pedidos/:id)
router.put('/:id', autenticar, (req, res) => {
    const pedidoId = req.params.id;
    const { status, dataFinalizacao, valorFrete, lucroVenda} = req.body;

    // Verifica se o status foi fornecido
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório.' });
    }

    // Atualiza o pedido no banco de dados
    const sql = 'UPDATE pedidos SET status = ?, data_finalizacao = ?, valor_frete = ?, lucro_venda = ? WHERE id = ?';
    db.query(sql, [status, dataFinalizacao, valorFrete, lucroVenda, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: `Pedido ID: ${pedidoId} atualizado para "${status}" com sucesso!` });
            console.log(`Pedido ID: ${pedidoId} atualizado para "${status}" com sucesso!`);
            return;
        } else {
            res.status(404).json({ error: 'Pedido nao encontrado.' });
        }
    });
});

// Rota para obter os pedidos finalizados aguardando envio do site
router.get('/site', autenticar, (req, res) => {
  const sql = `
  SELECT 
      p.*,
      (
          SELECT SUM(ip.quantidade) 
          FROM itens_pedido_usuario ip 
          WHERE ip.pedido_id = p.id AND ip.produto_id = 1
      ) AS quantidade_rape_pacotes
  FROM 
      pedidos_usuarios p
  WHERE 
      p.status IN ("Pronto, aguardando envio");
`;
db.query(sql, (err, results) => {
  if (err) {
    console.error('Erro ao buscar pedidos finalizados aguardando envio:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos finalizados aguardando envio.' });
    return;
  }

  // Itera sobre cada pedido encontrado
  const pedidosCompletos = results.map(pedido => {
    return new Promise((resolve, reject) => {
      // Busca o nome do cliente
      const sqlCliente = 'SELECT nome FROM usuarios WHERE id = ?';
      db.query(sqlCliente, [pedido.usuario_id], (err, cliente) => {
        if (err) {
          console.error('Erro ao buscar cliente:', err);
          reject('Erro ao buscar cliente.'); // Rejeita a promise em caso de erro
          return;
        }

        // Adiciona o nome do cliente ao objeto do pedido
        pedido.cliente = cliente[0].nome;

        // Busca o nome do vendedor
        const sqlVendedor = 'SELECT nome FROM vendedores WHERE id = ?';
        db.query(sqlVendedor, [pedido.vendedor_id], (err, vendedor) => {
          if (err) {
            console.error('Erro ao buscar vendedor:', err);
            reject('Erro ao buscar vendedor.'); // Rejeita a promise em caso de erro
            return;
          }

          // Adiciona o nome do vendedor ao objeto do pedido
          pedido.vendedor = vendedor[0].nome;

        // Busca o nome do produtor
        const sqlProdutor = 'SELECT nome FROM produtores WHERE id = ?';
        db.query(sqlProdutor, [pedido.produtor_id], (err, produtor) => {
          if (err) {
            console.error('Erro ao buscar produtor:', err);
            reject('Erro ao buscar produtor.'); // Rejeita a promise em caso de erro
            return;
          }

          // Adiciona o nome do produtor ao objeto do pedido
          pedido.produtor = produtor[0].nome;

          resolve(pedido); // Resolve a promise com o pedido completo
        });
      });
      });
    });
  });

  // Aguarda todas as promises serem resolvidas
  Promise.all(pedidosCompletos)
    .then(pedidos => {
      res.json(pedidos); // Envia os pedidos completos como resposta
    })
    .catch(err => {
      console.error('Erro ao buscar informações do pedido:', err);
      res.status(500).json({ error: 'Erro ao buscar informações do pedido.' });
    });
});
});

// Rota para atualizar um pedido do site
router.put('/site/:id', autenticar, (req, res) => {
  const pedidoId = req.params.id;
  const { status, dataFinalizacao, valorFrete, lucroVenda} = req.body;

  // Verifica se os atributos foram fornecidos
  if (!status) {
      return res.status(400).json({ error: 'O status é obrigatório.' });
  }
  if (!dataFinalizacao) {
    return res.status(400).json({ error: 'A data de finalização é obrigatória.' });
  }

  // Atualiza o pedido no banco de dados
  const sql = 'UPDATE pedidos_usuarios SET status = ?, data_finalizacao = ?, valor_frete = ?, lucro_venda = ? WHERE id = ?';
  db.query(sql, [status, dataFinalizacao, valorFrete, lucroVenda, pedidoId], (err, result) => {
      if (err) {
          console.error('Erro ao atualizar pedido:', err);
          res.status(500).json({ error: 'Erro ao atualizar pedido.' });
          return;
      }

      if (result.affectedRows > 0) {
          res.json({ message: `Pedido ID: ${pedidoId} atualizado para "${status}" com sucesso!` });
          console.log(`Pedido SITE ID: ${pedidoId} atualizado para "${status}" com sucesso!`);
          return;
      } else {
          res.status(404).json({ error: 'Pedido nao encontrado.' });
      }
  });
});

module.exports = router;
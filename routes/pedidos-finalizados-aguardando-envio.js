const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/auth');

// Rota para obter os pedidos finalizados aguardando envio (GET /api/pedidos/finalizados-aguardando-envio)
router.get('/', autenticar, (req, res) => {
    const sql = 'SELECT * FROM pedidos WHERE status IN ("Pronto, aguardando envio")';
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
    const { status, dataFinalizacao, valorFrete} = req.body;

    // Verifica se o status foi fornecido
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório.' });
    }

    // Atualiza o pedido no banco de dados
    const sql = 'UPDATE pedidos SET status = ?, data_finalizacao = ?, valor_frete = ? WHERE id = ?';
    db.query(sql, [status, dataFinalizacao, valorFrete, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
            return;
        }
    });
});

module.exports = router;
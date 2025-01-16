const express = require('express');
const router = express.Router();
const { db } = require('../../db');
const autenticar = require('../../middleware/auth');

// Rota para obter os pedidos finalizados (GET /api/pedidos/aguardando-producao)
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
          p.status IN ("Finalizado");
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Erro ao buscar pedidos finalizados:', err);
        res.status(500).json({ error: 'Erro ao buscar pedidos finalizados:' });
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

module.exports = router;
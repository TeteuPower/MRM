import {
    RAPES,
    CINZAS,
    PRODUTOS,
    INSUMOS,
    ESTOQUE,
    CLIENTES,
    VENDORES,
    PRODUTOES,
    SENHA_ADM,
    PEDIDOS,
    PAGAMENTOS,
    carregarDados,
    salvarDados
  } from "../js/dados.js";
  
  // Funções gerais
  
  // Função para gerar um ID único para um pedido
  function gerarIdPedido() {
    let id = Math.floor(Math.random() * 9000) + 1000;
    while (PEDIDOS[id]) {
      id = Math.floor(Math.random() * 9000) + 1000;
    }
    return id;
  }
  
  // Função para atualizar a quantidade total de um produto no estoque
  function atualizarEstoqueTotal(produto, quantidade, tipo, operacao) {
    if (operacao === "adicionar") {
      ESTOQUE[produto].total += quantidade;
      if (tipo) {
        ESTOQUE[produto].variedades[tipo] += quantidade;
      }
    } else if (operacao === "subtrair") {
      ESTOQUE[produto].total -= quantidade;
      if (tipo) {
        ESTOQUE[produto].variedades[tipo] -= quantidade;
      }
    }
  }
  
  // Função para atualizar a quantidade de um produto reservado no estoque
  function atualizarEstoqueReservado(produto, quantidade, tipo, operacao) {
    if (operacao === "adicionar") {
      ESTOQUE[produto].reservado += quantidade;
      if (tipo) {
        ESTOQUE[produto].variedades[tipo] += quantidade;
      }
    } else if (operacao === "subtrair") {
      ESTOQUE[produto].reservado -= quantidade;
      if (tipo) {
        ESTOQUE[produto].variedades[tipo] -= quantidade;
      }
    }
  }
  
  // Função para verificar se o usuário está logado como administrador
  function isAdministrador() {
    return localStorage.getItem("administrador") === "true";
  }
  
  // Funções de estoque
  
  // Função para adicionar ou remover um item do estoque
  function adicionarRemoverItemEstoque(
    produto,
    quantidade,
    tipo,
    operacao,
    modalConfirm
  ) {
    if (modalConfirm) {
      modalConfirm.style.display = "flex";
    } else {
      // Modal de confirmação
      let modal = document.createElement("div");
      modal.classList.add("modal", "estoque-modal");
      modal.innerHTML = `
        <div class="modal-content">
          <h2 class="modal-title">Confirmação</h2>
          <p class="modal-text">Você deseja ${
            operacao === "adicionar" ? "adicionar" : "remover"
          } ${quantidade} ${produto}${tipo ? " (" + tipo + ")" : ""} do estoque?</p>
          <button class="modal-button" onclick="confirmarAlteracaoEstoque('${produto}', ${quantidade}, '${tipo}', '${operacao}')">Sim</button>
          <button class="modal-button" onclick="fecharModalEstoque()">Não</button>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }
  
  // Função para confirmar a alteração no estoque
  function confirmarAlteracaoEstoque(produto, quantidade, tipo, operacao) {
    atualizarEstoqueTotal(produto, quantidade, tipo, operacao);
    if (produto === "Rapé" && operacao === "adicionar") {
      // Modal para confirmar a subtração de pacotes e adesivos
      let modal = document.createElement("div");
      modal.classList.add("modal", "estoque-modal");
      modal.innerHTML = `
        <div class="modal-content">
          <h2 class="modal-title">Confirmação</h2>
          <p class="modal-text">Deseja subtrair ${quantidade} pacotes e adesivos do estoque?</p>
          <button class="modal-button" onclick="subtrairInsumos('Pacotes', ${quantidade}, null, 'subtrair')">Sim</button>
          <button class="modal-button" onclick="fecharModalEstoque()">Não</button>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      fecharModalEstoque();
    }
    salvarDados();
  }
  
  // Função para subtrair os insumos utilizados na produção de rapé
  function subtrairInsumos(insumo, quantidade, tipo, operacao) {
    atualizarEstoqueTotal(insumo, quantidade, tipo, operacao);
    atualizarEstoqueTotal("Adesivos Grandes", quantidade, tipo, operacao);
    fecharModalEstoque();
    salvarDados();
  }
  
  // Função para fechar o modal do estoque
  function fecharModalEstoque() {
    let modal = document.querySelector(".estoque-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Funções de clientes
  
  // Função para adicionar um novo cliente
  function adicionarNovoCliente(nome, email, telefone, endereco, login, senha) {
    if (CLIENTES[login]) {
      alert("Login já existente!");
      return;
    }
    CLIENTES[login] = {
      nome: nome,
      email: email,
      telefone: telefone,
      endereco: endereco,
      senha: senha,
      saldoReal: 0,
      saldoDolar: 0
    };
    salvarDados();
  }
  
  // Funções de vendas
  
  // Função para adicionar um item ao carrinho
  function adicionarItemCarrinho(produto, quantidade, tipo) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    if (!carrinho[produto]) {
      carrinho[produto] = {};
    }
    if (tipo) {
      if (!carrinho[produto][tipo]) {
        carrinho[produto][tipo] = 0;
      }
      carrinho[produto][tipo] += quantidade;
    } else {
      carrinho[produto] += quantidade;
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }
  
  // Função para remover um item do carrinho
  function removerItemCarrinho(produto, tipo) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    if (tipo) {
      if (carrinho[produto][tipo]) {
        delete carrinho[produto][tipo];
      }
    } else {
      if (carrinho[produto]) {
        delete carrinho[produto];
      }
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }
  
  // Função para finalizar a venda
  function finalizarVenda(cliente, vendedor, valorVenda, valorPago, moeda, descricao) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    let pedido = {
      id: gerarIdPedido(),
      cliente: cliente,
      vendedor: vendedor,
      data: new Date(),
      valorVenda: valorVenda,
      valorPago: valorPago,
      moeda: moeda,
      descricao: descricao,
      status: "Em produção",
      itens: carrinho,
      lote: {},
      frete: null,
      produtor: null,
      notaFiscal: null,
      solicitadoPor: "administrador"
    };
    // Atualizar saldo do cliente
    if (moeda === "real") {
      CLIENTES[cliente].saldoReal -= valorVenda;
      CLIENTES[cliente].saldoReal += valorPago;
    } else if (moeda === "dolar") {
      CLIENTES[cliente].saldoDolar -= valorVenda;
      CLIENTES[cliente].saldoDolar += valorPago;
    }
    // Reservar produtos no estoque
    for (let produto in carrinho) {
      if (PRODUTOS.includes(produto)) {
        let quantidade = carrinho[produto];
        if (produto === "Rapé") {
          for (let tipo in carrinho[produto]) {
            atualizarEstoqueReservado(produto, quantidade, tipo, "adicionar");
          }
        } else {
          atualizarEstoqueReservado(produto, quantidade, null, "adicionar");
        }
      }
    }
    // Adicionar pedido
    PEDIDOS[pedido.id] = pedido;
    localStorage.setItem("carrinho", JSON.stringify({}));
    salvarDados();
  }
  
  // Funções de pedidos
  
  // Função para atualizar o status do pedido
  function atualizarStatusPedido(id, status, lote) {
    PEDIDOS[id].status = status;
    if (status === "Pronto, aguardando envio") {
      PEDIDOS[id].lote = lote;
      // Subtrair estoque reservado
      for (let produto in PEDIDOS[id].itens) {
        if (PRODUTOS.includes(produto)) {
          let quantidade = PEDIDOS[id].itens[produto];
          if (produto === "Rapé") {
            for (let tipo in PEDIDOS[id].itens[produto]) {
              atualizarEstoqueReservado(produto, quantidade, tipo, "subtrair");
            }
          } else {
            atualizarEstoqueReservado(produto, quantidade, null, "subtrair");
          }
        }
      }
    }
    salvarDados();
  }
  
  // Função para adicionar o valor do frete e produtor ao pedido
  function adicionarFreteProdutor(id, frete, produtor) {
    PEDIDOS[id].frete = frete;
    PEDIDOS[id].produtor = produtor;
    salvarDados();
  }
  
  // Funções de funcionários
  
  // Função para adicionar um novo vendedor
  function adicionarNovoVendedor(nome) {
    VENDORES.push(nome);
    salvarDados();
  }
  
  // Função para remover um vendedor
  function removerVendedor(nome) {
    VENDORES = VENDORES.filter((vendedor) => vendedor !== nome);
    salvarDados();
  }
  
  // Função para adicionar um novo produtor
  function adicionarNovoProdutor(nome) {
    PRODUTOES.push(nome);
    salvarDados();
  }
  
  // Função para remover um produtor
  function removerProdutor(nome) {
    PRODUTOES = PRODUTOES.filter((produtor) => produtor !== nome);
    salvarDados();
  }
  
  // Funções de finanças
  
  // Função para adicionar um novo pagamento de cliente
  function adicionarPagamentoCliente(cliente, valor, moeda, data) {
    let pagamento = {
      cliente: cliente,
      valor: valor,
      moeda: moeda,
      data: data
    };
    PAGAMENTOS[pagamento.cliente] = PAGAMENTOS[pagamento.cliente] || [];
    PAGAMENTOS[pagamento.cliente].push(pagamento);
    if (moeda === "real") {
      CLIENTES[cliente].saldoReal += valor;
    } else if (moeda === "dolar") {
      CLIENTES[cliente].saldoDolar += valor;
    }
    salvarDados();
  }
  
  // Função para marcar o repasse da comissão do produtor como feito
  function marcarRepasseComissao(produtor, pedido) {
    PEDIDOS[pedido].repasseComissao = "Feito!";
    salvarDados();
  }
  
  // Exporta as funções
  export {
    gerarIdPedido,
    atualizarEstoqueTotal,
    atualizarEstoqueReservado,
    isAdministrador,
    adicionarRemoverItemEstoque,
    confirmarAlteracaoEstoque,
    subtrairInsumos,
    fecharModalEstoque,
    adicionarNovoCliente,
    adicionarItemCarrinho,
    removerItemCarrinho,
    finalizarVenda,
    atualizarStatusPedido,
    adicionarFreteProdutor,
    adicionarNovoVendedor,
    removerVendedor,
    adicionarNovoProdutor,
    removerProdutor,
    adicionarPagamentoCliente,
    marcarRepasseComissao
  };
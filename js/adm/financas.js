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
    salvarDados,
    adicionarPagamentoCliente,
    marcarRepasseComissao
  } from "../../js/funcoes.js";
  
  // Inicialização
  carregarDados();
  
  // Função para exibir os vendedores e seus lucros no último mês
  function exibirLucrosVendedores() {
    let vendedoresContainer = document.getElementById("vendedores-lucro");
    vendedoresContainer.innerHTML = "";
    let dataAtual = new Date();
    let primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    VENDORES.forEach((vendedor) => {
      let lucroVendedor = 0;
      Object.entries(PEDIDOS).forEach(([id, pedido]) => {
        if (
          pedido.vendedor === vendedor &&
          pedido.status === "Finalizado" &&
          pedido.data >= primeiroDiaMes
        ) {
          lucroVendedor += pedido.valorVenda - pedido.frete - pedido.comissao;
        }
      });
      let vendedorContainer = document.createElement("div");
      vendedorContainer.classList.add("vendedor-lucro-container");
      vendedorContainer.innerHTML = `
        <p>${vendedor}</p>
        <p>Lucro: R$${lucroVendedor.toFixed(2)}</p>
      `;
      vendedoresContainer.appendChild(vendedorContainer);
    });
  }
  
  // Função para exibir os produtores e seus lucros no último mês
  function exibirLucrosProdutores() {
    let produtoresContainer = document.getElementById("produtores-lucro");
    produtoresContainer.innerHTML = "";
    let dataAtual = new Date();
    let primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    PRODUTOES.forEach((produtor) => {
      let lucroProdutor = 0;
      Object.entries(PEDIDOS).forEach(([id, pedido]) => {
        if (
          pedido.produtor === produtor &&
          pedido.status === "Finalizado" &&
          pedido.data >= primeiroDiaMes
        ) {
          lucroProdutor += pedido.comissao;
        }
      });
      let produtorContainer = document.createElement("div");
      produtorContainer.classList.add("produtor-lucro-container");
      produtorContainer.innerHTML = `
        <p>${produtor}</p>
        <p>Lucro: R$${lucroProdutor.toFixed(2)}</p>
      `;
      produtoresContainer.appendChild(produtorContainer);
    });
  }
  
  // Função para exibir o lucro total da empresa no último mês
  function exibirLucroTotal() {
    let lucroTotal = 0;
    let dataAtual = new Date();
    let primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    Object.entries(PEDIDOS).forEach(([id, pedido]) => {
      if (
        pedido.status === "Finalizado" &&
        pedido.data >= primeiroDiaMes
      ) {
        lucroTotal += pedido.valorVenda - pedido.frete - pedido.comissao;
      }
    });
    let lucroTotalContainer = document.getElementById("lucro-total");
    lucroTotalContainer.textContent = `Lucro Total: R$${lucroTotal.toFixed(2)}`;
  }
  
  // Função para exibir a lista de clientes com saldo negativo
  function exibirClientesSaldoNegativo() {
    let clientesContainer = document.getElementById("clientes-saldo-negativo");
    clientesContainer.innerHTML = "";
    for (let cliente in CLIENTES) {
      if (CLIENTES[cliente].saldoReal < 0) {
        let clienteContainer = document.createElement("div");
        clienteContainer.classList.add("cliente-saldo-negativo-container");
        clienteContainer.innerHTML = `
          <p>${CLIENTES[cliente].nome}</p>
          <p>Saldo: R$${CLIENTES[cliente].saldoReal.toFixed(2)}</p>
        `;
        clientesContainer.appendChild(clienteContainer);
      }
    }
  }
  
  // Função para adicionar um novo pagamento de cliente
  function adicionarPagamento() {
    let cliente = document.getElementById("cliente-pagamento").value;
    let valor = parseFloat(document.getElementById("valor-pagamento").value);
    let moeda = document.getElementById("moeda-pagamento").value;
    let data = new Date();
    adicionarPagamentoCliente(cliente, valor, moeda, data);
    document.getElementById("cliente-pagamento").value = "";
    document.getElementById("valor-pagamento").value = "";
    document.getElementById("moeda-pagamento").value = "real";
  }
  
  // Função para marcar o repasse da comissão do produtor como feito
  function marcarRepasse() {
    let produtor = document.getElementById("produtor-repasse").value;
    let pedido = parseInt(document.getElementById("pedido-repasse").value);
    marcarRepasseComissao(produtor, pedido);
    document.getElementById("produtor-repasse").value = "";
    document.getElementById("pedido-repasse").value = "";
  }
  
  // Carrega as informações na página
  window.onload = () => {
    exibirLucrosVendedores();
    exibirLucrosProdutores();
    exibirLucroTotal();
    exibirClientesSaldoNegativo();
  
    // Adiciona os clientes à lista de pagamento
    let selectCliente = document.getElementById("cliente-pagamento");
    for (let cliente in CLIENTES) {
      let option = document.createElement("option");
      option.value = cliente;
      option.textContent = CLIENTES[cliente].nome;
      selectCliente.appendChild(option);
    }
  
    // Adiciona os produtores à lista de repasse de comissão
    let selectProdutor = document.getElementById("produtor-repasse");
    PRODUTOES.forEach((produtor) => {
      let option = document.createElement("option");
      option.value = produtor;
      option.textContent = produtor;
      selectProdutor.appendChild(option);
    });
  };
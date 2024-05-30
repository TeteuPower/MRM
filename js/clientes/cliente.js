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
    adicionarItemCarrinho,
    removerItemCarrinho,
    finalizarVenda
  } from "../../js/funcoes.js";
  
  // Inicialização
  carregarDados();
  
  // Função para carregar a lista de vendedores na página
  function carregarVendedores() {
    let selectVendedor = document.getElementById("vendedor-venda");
    VENDORES.forEach((vendedor) => {
      let option = document.createElement("option");
      option.value = vendedor;
      option.textContent = vendedor;
      selectVendedor.appendChild(option);
    });
  }
  
  // Função para abrir o modal de adicionar produto ao carrinho
  function abrirModalAdicionarProduto() {
    let modal = document.createElement("div");
    modal.classList.add("modal", "adicionar-produto-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalAdicionarProduto()">×</span>
        <h2 class="modal-title">Adicionar Produto</h2>
        <select id="produto-adicionar" class="select">
          ${PRODUTOS.map((produto) => `<option value="${produto}">${produto}</option>`).join("")}
        </select>
        <div id="tipo-produto" style="display: none;">
          <label for="tipo-adicionar">Tipo:</label>
          <select id="tipo-adicionar" class="select">
            ${RAPES.map((tipo) => `<option value="${tipo}">${tipo}</option>`).join("")}
          </select>
        </div>
        <input type="number" id="quantidade-adicionar" placeholder="Quantidade" class="input">
        <button class="modal-button" onclick="adicionarProdutoCarrinho()">Adicionar</button>
      </div>
    `;
    document.body.appendChild(modal);
    // Exibe a lista de tipos de rapé se o produto selecionado for rapé
    document.getElementById("produto-adicionar").addEventListener("change", () => {
      if (document.getElementById("produto-adicionar").value === "Rapé") {
        document.getElementById("tipo-produto").style.display = "block";
      } else {
        document.getElementById("tipo-produto").style.display = "none";
      }
    });
  }
  
  // Função para adicionar o produto ao carrinho
  function adicionarProdutoCarrinho() {
    let produto = document.getElementById("produto-adicionar").value;
    let quantidade = parseInt(document.getElementById("quantidade-adicionar").value);
    let tipo = document.getElementById("tipo-adicionar").value;
    adicionarItemCarrinho(produto, quantidade, tipo);
    atualizarCarrinho();
    fecharModalAdicionarProduto();
  }
  
  // Função para atualizar o carrinho de compras na página
  function atualizarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    let carrinhoContainer = document.getElementById("carrinho-container");
    carrinhoContainer.innerHTML = "";
    let totalRape = 0;
    for (let produto in carrinho) {
      let quantidade = carrinho[produto];
      let tipo = null;
      if (produto === "Rapé") {
        // Adiciona a quantidade de rapé do tipo selecionado
        for (let tipo in carrinho[produto]) {
          totalRape += carrinho[produto][tipo];
          let itemCarrinho = document.createElement("div");
          itemCarrinho.classList.add("item-carrinho");
          itemCarrinho.innerHTML = `
            <div class="coluna-produto">Rapé ${tipo}</div>
            <div class="coluna-quantidade">${
              carrinho[produto][tipo]
            }Kg (${carrinho[produto][tipo] * 2} Pacotes)</div>
            <div class="coluna-acoes">
              <button class="modal-button" onclick="removerItemCarrinho('${produto}', '${tipo}')">Remover</button>
            </div>
          `;
          carrinhoContainer.appendChild(itemCarrinho);
        }
      } else {
        // Adiciona a quantidade do produto selecionado
        let itemCarrinho = document.createElement("div");
        itemCarrinho.classList.add("item-carrinho");
        itemCarrinho.innerHTML = `
          <div class="coluna-produto">${produto}</div>
          <div class="coluna-quantidade">${quantidade} Un.</div>
          <div class="coluna-acoes">
            <button class="modal-button" onclick="removerItemCarrinho('${produto}', '${tipo}')">Remover</button>
          </div>
        `;
        carrinhoContainer.appendChild(itemCarrinho);
      }
    }
    // Exibe a quantidade total de rapé no carrinho
    let totalRapeKg = totalRape * 0.5;
    let totalRapePacotes = totalRape;
    let quantidadeTotalRape = document.getElementById("quantidade-total-rapee");
    quantidadeTotalRape.textContent = `Quantidade total de rapé: ${totalRapeKg}Kg (${totalRapePacotes} pacotes)`;
  }
  
  // Função para fechar o modal de adicionar produto ao carrinho
  function fecharModalAdicionarProduto() {
    let modal = document.querySelector(".adicionar-produto-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para abrir o modal de confirmação de venda
  function abrirModalFinalizarVenda() {
    let cliente = localStorage.getItem("clienteLogado");
    let vendedor = document.getElementById("vendedor-venda").value;
    let valorVenda = parseFloat(document.getElementById("valor-venda").value);
    let valorPago = parseFloat(
      document.getElementById("valor-pago").value
    );
    let moeda = document.getElementById("moeda-venda").value;
    let descricao = document.getElementById("descricao-venda").value;
    let modal = document.createElement("div");
    modal.classList.add("modal", "finalizar-venda-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">Confirmação</h2>
        <p class="modal-text">Você deseja finalizar a venda?</p>
        <button class="modal-button" onclick="confirmarFinalizarVenda('${cliente}', '${vendedor}', ${valorVenda}, ${valorPago}, '${moeda}', '${descricao}')">Sim</button>
        <button class="modal-button" onclick="fecharModalFinalizarVenda()">Não</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para confirmar a finalização da venda
  function confirmarFinalizarVenda(
    cliente,
    vendedor,
    valorVenda,
    valorPago,
    moeda,
    descricao
  ) {
    finalizarVenda(cliente, vendedor, valorVenda, valorPago, moeda, descricao);
    fecharModalFinalizarVenda();
    atualizarCarrinho();
    // Limpa o formulário
    document.getElementById("vendedor-venda").value = "";
    document.getElementById("valor-venda").value = "";
    document.getElementById("valor-pago").value = "";
    document.getElementById("moeda-venda").value = "real";
    document.getElementById("descricao-venda").value = "";
  }
  
  // Função para fechar o modal de confirmação de venda
  function fecharModalFinalizarVenda() {
    let modal = document.querySelector(".finalizar-venda-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para limpar o formulário de nova venda
  function limparFormularioNovaVenda() {
    document.getElementById("vendedor-venda").value = "";
    document.getElementById("valor-venda").value = "";
    document.getElementById("valor-pago").value = "";
    document.getElementById("moeda-venda").value = "real";
    document.getElementById("descricao-venda").value = "";
    atualizarCarrinho();
  }
  
  // Carrega as informações na página
  window.onload = () => {
    carregarVendedores();
    atualizarCarrinho();
    limparFormularioNovaVenda();
  };
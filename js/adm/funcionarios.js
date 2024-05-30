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
    adicionarNovoVendedor,
    removerVendedor,
    adicionarNovoProdutor,
    removerProdutor,
    marcarRepasseComissao
  } from "../../js/funcoes.js";
  
  // Inicialização
  carregarDados();
  
  // Função para exibir a lista de vendedores na página
  function exibirVendedores() {
    let vendedoresContainer = document.getElementById("vendedores-container");
    vendedoresContainer.innerHTML = "";
    VENDORES.forEach((vendedor) => {
      let vendedorContainer = document.createElement("div");
      vendedorContainer.classList.add("vendedor-container");
      vendedorContainer.innerHTML = `
        <p>${vendedor}</p>
        <button class="modal-button" onclick="abrirModalDetalhesVendedor('${vendedor}')">Ver Detalhes</button>
        <button class="modal-button" onclick="abrirModalRemoverVendedor('${vendedor}')">Remover</button>
      `;
      vendedoresContainer.appendChild(vendedorContainer);
    });
  }
  
  // Função para abrir o modal de detalhes do vendedor
  function abrirModalDetalhesVendedor(vendedor) {
    let modal = document.createElement("div");
    modal.classList.add("modal", "detalhes-vendedor-modal");
    let vendasVendedor = "";
    let paginaAtual = parseInt(
      localStorage.getItem(`pagina-vendas-${vendedor}`) || "1"
    );
    // Filtra as vendas do vendedor e ordena por data
    let vendasFiltradas = Object.entries(PEDIDOS)
      .filter(([_, pedido]) => pedido.vendedor === vendedor)
      .sort((a, b) => {
        let dataA = new Date(a[1].data);
        let dataB = new Date(b[1].data);
        return dataB - dataA;
      })
      .slice((paginaAtual - 1) * 10, paginaAtual * 10);
    vendasFiltradas.forEach(([id, pedido]) => {
      vendasVendedor += `
        <tr>
          <td>Pedido nº ${pedido.id}</td>
          <td>${CLIENTES[pedido.cliente].nome}</td>
          <td>${pedido.status === "Finalizado" ? pedido.data.toLocaleDateString() : "NF"}</td>
          <td>${pedido.valorVenda.toFixed(2)} ${pedido.moeda}</td>
          <td>${pedido.status === "Finalizado" ? pedido.frete.toFixed(2) : "NF"}</td>
          <td>${
            pedido.status === "Finalizado"
              ? (
                  (pedido.valorVenda - pedido.frete) *
                  (4 / 25)
                ).toFixed(2)
              : "NF"
          }</td>
          <td>${
            pedido.status === "Finalizado" && pedido.produtor
              ? PEDIDOS[id].comissao.toFixed(2)
              : "NF"
          }</td>
          <td>${pedido.status}</td>
        </tr>
      `;
    });
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalDetalhesVendedor()">×</span>
        <h2 class="modal-title">Detalhes do Vendedor</h2>
        <p>Nome: ${vendedor}</p>
        <table>
          <thead>
            <tr>
              <th>Pedidos</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Frete</th>
              <th>Insumos</th>
              <th>Produção</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${vendasVendedor}
          </tbody>
        </table>
        ${
          vendasFiltradas.length < paginaAtual * 10
            ? ""
            : `<button class="modal-button" onclick="abrirModalDetalhesVendedor('${vendedor}')">Próxima Página</button>`
        }
        <button class="modal-button" onclick="fecharModalDetalhesVendedor()">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para fechar o modal de detalhes do vendedor
  function fecharModalDetalhesVendedor() {
    let modal = document.querySelector(".detalhes-vendedor-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para abrir o modal de remoção do vendedor
  function abrirModalRemoverVendedor(vendedor) {
    let modal = document.createElement("div");
    modal.classList.add("modal", "remover-vendedor-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">Confirmação</h2>
        <p class="modal-text">Você deseja remover o vendedor ${vendedor}?</p>
        <button class="modal-button" onclick="confirmarRemoverVendedor('${vendedor}')">Sim</button>
        <button class="modal-button" onclick="fecharModalRemoverVendedor()">Não</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para confirmar a remoção do vendedor
  function confirmarRemoverVendedor(vendedor) {
    removerVendedor(vendedor);
    fecharModalRemoverVendedor();
    exibirVendedores();
  }
  
  // Função para fechar o modal de remoção do vendedor
  function fecharModalRemoverVendedor() {
    let modal = document.querySelector(".remover-vendedor-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para adicionar um novo vendedor
  function adicionarNovoVendedor() {
    let novoVendedor = document.getElementById("novo-vendedor").value;
    adicionarNovoVendedor(novoVendedor);
    document.getElementById("novo-vendedor").value = "";
    exibirVendedores();
  }
  
  // Função para exibir a lista de produtores na página
  function exibirProdutores() {
    let produtoresContainer = document.getElementById("produtores-container");
    produtoresContainer.innerHTML = "";
    PRODUTOES.forEach((produtor) => {
      let produtorContainer = document.createElement("div");
      produtorContainer.classList.add("produtor-container");
      produtorContainer.innerHTML = `
        <p>${produtor}</p>
        <button class="modal-button" onclick="abrirModalDetalhesProdutor('${produtor}')">Ver Detalhes</button>
        <button class="modal-button" onclick="abrirModalRemoverProdutor('${produtor}')">Remover</button>
      `;
      produtoresContainer.appendChild(produtorContainer);
    });
  }
  
  // Função para abrir o modal de detalhes do produtor
  function abrirModalDetalhesProdutor(produtor) {
    let modal = document.createElement("div");
    modal.classList.add("modal", "detalhes-produtor-modal");
    let producoesProdutor = "";
    let paginaAtual = parseInt(
      localStorage.getItem(`pagina-producoes-${produtor}`) || "1"
    );
    // Filtra as produções do produtor e ordena por data
    let producoesFiltradas = Object.entries(PEDIDOS)
      .filter(([_, pedido]) => pedido.produtor === produtor)
      .sort((a, b) => {
        let dataA = new Date(a[1].data);
        let dataB = new Date(b[1].data);
        return dataB - dataA;
      })
      .slice((paginaAtual - 1) * 10, paginaAtual * 10);
    producoesFiltradas.forEach(([id, pedido]) => {
      producoesProdutor += `
        <tr>
          <td>Pedido nº ${pedido.id}</td>
          <td>${pedido.vendedor}</td>
          <td>${pedido.data.toLocaleDateString()}</td>
          <td>${pedido.status === "Finalizado" ? pedido.data.toLocaleDateString() : "NF"}</td>
          <td>${pedido.comissao.toFixed(2)}</td>
          <td>${pedido.repasseComissao || "Não feito"}</td>
        </tr>
      `;
    });
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalDetalhesProdutor()">×</span>
        <h2 class="modal-title">Detalhes do Produtor</h2>
        <p>Nome: ${produtor}</p>
        <table>
          <thead>
            <tr>
              <th>Pedidos</th>
              <th>Vendedor</th>
              <th>Data Solicitada</th>
              <th>Finalizado</th>
              <th>Comissão</th>
              <th>Status do Repasse</th>
            </tr>
          </thead>
          <tbody>
            ${producoesProdutor}
          </tbody>
        </table>
        ${
          producoesFiltradas.length < paginaAtual * 10
            ? ""
            : `<button class="modal-button" onclick="abrirModalDetalhesProdutor('${produtor}')">Próxima Página</button>`
        }
        <button class="modal-button" onclick="fecharModalDetalhesProdutor()">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para fechar o modal de detalhes do produtor
  function fecharModalDetalhesProdutor() {
    let modal = document.querySelector(".detalhes-produtor-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para abrir o modal de remoção do produtor
  function abrirModalRemoverProdutor(produtor) {
    let modal = document.createElement("div");
    modal.classList.add("modal", "remover-produtor-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">Confirmação</h2>
        <p class="modal-text">Você deseja remover o produtor ${produtor}?</p>
        <button class="modal-button" onclick="confirmarRemoverProdutor('${produtor}')">Sim</button>
        <button class="modal-button" onclick="fecharModalRemoverProdutor()">Não</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para confirmar a remoção do produtor
  function confirmarRemoverProdutor(produtor) {
    removerProdutor(produtor);
    fecharModalRemoverProdutor();
    exibirProdutores();
  }
  
  // Função para fechar o modal de remoção do produtor
  function fecharModalRemoverProdutor() {
    let modal = document.querySelector(".remover-produtor-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para adicionar um novo produtor
  function adicionarNovoProdutor() {
    let novoProdutor = document.getElementById("novo-produtor").value;
    adicionarNovoProdutor(novoProdutor);
    document.getElementById("novo-produtor").value = "";
    exibirProdutores();
  }
  
  // Carrega as informações na página
  window.onload = () => {
    exibirVendedores();
    exibirProdutores();
  };
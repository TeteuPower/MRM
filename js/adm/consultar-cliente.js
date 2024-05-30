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
  } from "../../js/funcoes.js";
  
  // Inicialização
  carregarDados();
  
  // Função para exibir a lista de clientes na página
  function exibirClientes() {
    let clientesContainer = document.getElementById("clientes-container");
    clientesContainer.innerHTML = "";
    for (let cliente in CLIENTES) {
      let clienteContainer = document.createElement("div");
      clienteContainer.classList.add("cliente-container");
      clienteContainer.innerHTML = `
        <p>${CLIENTES[cliente].nome}</p>
        <button class="modal-button" onclick="abrirModalDetalhesCliente('${cliente}')">Ver Detalhes</button>
      `;
      clientesContainer.appendChild(clienteContainer);
    }
  }
  
  // Função para abrir o modal de detalhes do cliente
  function abrirModalDetalhesCliente(cliente) {
    let modal = document.createElement("div");
    modal.classList.add("modal", "detalhes-cliente-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalDetalhesCliente()">×</span>
        <h2 class="modal-title">Detalhes do Cliente</h2>
        <p>Nome: ${CLIENTES[cliente].nome}</p>
        <p>E-mail: ${CLIENTES[cliente].email}</p>
        <p>Telefone: ${CLIENTES[cliente].telefone}</p>
        <p>Endereço: ${CLIENTES[cliente].endereco}</p>
        <p>Login: ${cliente}</p>
        <p>Saldo em Real: R$ ${CLIENTES[cliente].saldoReal.toFixed(2)}</p>
        <p>Saldo em Dólar: US$ ${CLIENTES[cliente].saldoDolar.toFixed(2)}</p>
        <button class="modal-button" onclick="abrirModalExtratoCliente('${cliente}')">Extrato do Cliente</button>
        <button class="modal-button" onclick="fecharModalDetalhesCliente()">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para abrir o modal do extrato do cliente
  function abrirModalExtratoCliente(cliente) {
    let modal = document.createElement("div");
    modal.classList.add("modal", "extrato-cliente-modal");
    let extrato = "";
    // Ordena os pagamentos do cliente por data
    let pagamentosOrdenados = (PAGAMENTOS[cliente] || []).sort((a, b) => {
      let dataA = new Date(a.data);
      let dataB = new Date(b.data);
      return dataB - dataA;
    });
    // Monta o extrato com os pedidos e pagamentos do cliente
    pagamentosOrdenados.forEach((pagamento) => {
      extrato += `
        <tr>
          <td>${pagamento.cliente === "Pagamento" ? "Pagamento" : `Pedido nº ${pagamento.id}`}</td>
          <td>${pagamento.data.toLocaleString()}</td>
          <td>${
            pagamento.cliente === "Pagamento"
              ? "--"
              : `-${pagamento.valor.toFixed(2)} ${pagamento.moeda}`
          }</td>
          <td>${
            pagamento.cliente === "Pagamento"
              ? `${pagamento.valor.toFixed(2)} ${pagamento.moeda}`
              : "--"
          }</td>
          <td>${(
            pagamento.cliente === "Pagamento"
              ? CLIENTES[cliente].saldoReal
              : CLIENTES[cliente].saldoReal - pagamento.valor
          ).toFixed(2)}</td>
        </tr>
      `;
    });
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalExtratoCliente()">×</span>
        <h2 class="modal-title">Extrato do Cliente</h2>
        <p>Saldo do Cliente: ${CLIENTES[cliente].saldoReal.toFixed(
      2
    )} (Real) / ${CLIENTES[cliente].saldoDolar.toFixed(
      2
    )} (Dólar)</p>
        <table>
          <thead>
            <tr>
              <th>Pedidos</th>
              <th>Data</th>
              <th>Valor do Pedido</th>
              <th>Pagamento</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${extrato}
          </tbody>
        </table>
        <button class="modal-button" onclick="fecharModalExtratoCliente()">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para fechar o modal de detalhes do cliente
  function fecharModalDetalhesCliente() {
    let modal = document.querySelector(".detalhes-cliente-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para fechar o modal do extrato do cliente
  function fecharModalExtratoCliente() {
    let modal = document.querySelector(".extrato-cliente-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para pesquisar clientes
  function pesquisarClientes() {
    let termoPesquisa = document
      .getElementById("pesquisa-cliente")
      .value.toLowerCase();
    let clientesContainer = document.getElementById("clientes-container");
    clientesContainer.innerHTML = "";
    for (let cliente in CLIENTES) {
      if (
        CLIENTES[cliente].nome.toLowerCase().includes(termoPesquisa) ||
        cliente.toLowerCase().includes(termoPesquisa)
      ) {
        let clienteContainer = document.createElement("div");
        clienteContainer.classList.add("cliente-container");
        clienteContainer.innerHTML = `
          <p>${CLIENTES[cliente].nome}</p>
          <button class="modal-button" onclick="abrirModalDetalhesCliente('${cliente}')">Ver Detalhes</button>
        `;
        clientesContainer.appendChild(clienteContainer);
      }
    }
  }
  
  // Carrega as informações na página
  window.onload = () => {
    exibirClientes();
  };
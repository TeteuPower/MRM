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
    atualizarStatusPedido,
    adicionarFreteProdutor
  } from "../../js/funcoes.js";
  
  // Inicialização
  carregarDados();
  
  // Função para exibir os pedidos na página
  function exibirPedidos() {
    let pedidosNaoFinalizadosContainer = document.getElementById(
      "pedidos-nao-finalizados"
    );
    let pedidosFinalizadosContainer = document.getElementById(
      "pedidos-finalizados"
    );
    pedidosNaoFinalizadosContainer.innerHTML = "";
    pedidosFinalizadosContainer.innerHTML = "";
    // Ordena os pedidos finalizados por data
    let pedidosFinalizadosOrdenados = Object.entries(PEDIDOS)
      .filter(([_, pedido]) => pedido.status === "Finalizado")
      .sort((a, b) => {
        let dataA = new Date(a[1].data);
        let dataB = new Date(b[1].data);
        return dataB - dataA;
      });
    // Exibe os pedidos não finalizados
    for (let id in PEDIDOS) {
      let pedido = PEDIDOS[id];
      if (pedido.status !== "Finalizado") {
        let pedidoContainer = document.createElement("div");
        pedidoContainer.classList.add("pedido-container");
        pedidoContainer.innerHTML = `
          <div class="pedido-resumo">
            <p>Pedido nº: ${pedido.id}</p>
            <p>Cliente: ${CLIENTES[pedido.cliente].nome}</p>
            <p>Status: ${pedido.status}</p>
          </div>
          <button class="modal-button" onclick="abrirModalDetalhesPedido(${id})">Ver Detalhes</button>
        `;
        pedidosNaoFinalizadosContainer.appendChild(pedidoContainer);
      }
    }
    // Exibe os pedidos finalizados (máximo de 5 por página)
    let paginaAtual = parseInt(
      localStorage.getItem("pagina-pedidos-finalizados") || "1"
    );
    let pedidosFinalizados = pedidosFinalizadosOrdenados.slice(
      (paginaAtual - 1) * 5,
      paginaAtual * 5
    );
    pedidosFinalizados.forEach(([id, pedido]) => {
      let pedidoContainer = document.createElement("div");
      pedidoContainer.classList.add("pedido-container");
      pedidoContainer.innerHTML = `
        <div class="pedido-resumo">
          <p>Pedido nº: ${pedido.id}</p>
          <p>Cliente: ${CLIENTES[pedido.cliente].nome}</p>
          <p>Status: ${pedido.status}</p>
        </div>
        <button class="modal-button" onclick="abrirModalDetalhesPedido(${id})">Ver Detalhes</button>
      `;
      pedidosFinalizadosContainer.appendChild(pedidoContainer);
    });
    // Adiciona o botão de próxima página se houver mais pedidos finalizados
    if (
      pedidosFinalizadosOrdenados.length > paginaAtual * 5 &&
      paginaAtual <
        Math.ceil(pedidosFinalizadosOrdenados.length / 5)
    ) {
      let proximaPaginaButton = document.createElement("button");
      proximaPaginaButton.classList.add("modal-button");
      proximaPaginaButton.textContent = "Próxima Página";
      proximaPaginaButton.onclick = () => {
        localStorage.setItem(
          "pagina-pedidos-finalizados",
          (paginaAtual + 1).toString()
        );
        exibirPedidos();
      };
      pedidosFinalizadosContainer.appendChild(proximaPaginaButton);
    }
  }
  
  // Função para abrir o modal de detalhes do pedido
  function abrirModalDetalhesPedido(id) {
    let pedido = PEDIDOS[id];
    let modal = document.createElement("div");
    modal.classList.add("modal", "detalhes-pedido-modal");
    let itensPedido = "";
    let totalRape = 0;
    for (let produto in pedido.itens) {
      if (PRODUTOS.includes(produto)) {
        if (produto === "Rapé") {
          // Adiciona a quantidade de rapé do tipo selecionado
          for (let tipo in pedido.itens[produto]) {
            totalRape += pedido.itens[produto][tipo];
            itensPedido += `
              <tr>
                <td>${produto} ${tipo}</td>
                <td>${pedido.itens[produto][tipo]}Kg (${
              pedido.itens[produto][tipo] * 2
            } Pacotes)</td>
                <td>Lote: ${pedido.lote[tipo] || "-"}</td>
              </tr>
            `;
          }
        } else {
          // Adiciona a quantidade do produto selecionado
          itensPedido += `
            <tr>
              <td>${produto}</td>
              <td>${pedido.itens[produto]} Un.</td>
              <td>Lote: -</td>
            </tr>
          `;
        }
      }
    }
    let modalContent = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalDetalhesPedido()">×</span>
        <h2 class="modal-title">Detalhes do Pedido</h2>
        <p>Número do Pedido: ${pedido.id}</p>
        <p>Cliente: ${CLIENTES[pedido.cliente].nome}</p>
        <p>Vendedor: ${pedido.vendedor}</p>
        <p>Descrição: ${pedido.descricao}</p>
        <p>Data de criação: ${pedido.data.toLocaleString()}</p>
        <p>Valor da Venda: ${pedido.valorVenda} ${pedido.moeda}</p>
        <p>Valor pago: ${pedido.valorPago} ${pedido.moeda}</p>
        <p>Status: ${pedido.status}</p>
        <p>Solicitado por: ${pedido.solicitadoPor}</p>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Lote</th>
            </tr>
          </thead>
          <tbody>
            ${itensPedido}
          </tbody>
        </table>
        ${
          pedido.status === "Pronto, aguardando envio"
            ? `
                <div class="frete-produtor">
                  <label for="frete-pedido">Frete (${pedido.moeda}): </label>
                  <input type="number" id="frete-pedido" value="${
                    pedido.frete || ""
                  }" class="input">
                  <select id="produtor-pedido" class="select">
                    ${PRODUTOES.map((produtor) => `<option value="${produtor}">${produtor}</option>`).join("")}
                  </select>
                  <button class="modal-button" onclick="confirmarFreteProdutor(${id})">Confirmar</button>
                </div>
              `
            : ""
        }
        ${
          pedido.status === "Pronto, aguardando envio"
            ? `
                <button class="modal-button" onclick="abrirModalFinalizarPedido(${id})">Finalizar Pedido</button>
              `
            : ""
        }
        ${
          pedido.status === "Finalizado"
            ? `
                <button class="modal-button" onclick="adicionarNotaFiscal(${id})">Adicionar Nota Fiscal</button>
                ${
                  pedido.notaFiscal
                    ? `<button class="modal-button" onclick="baixarNotaFiscal(${id})">Consultar Nota Fiscal</button>`
                    : ""
                }
              `
            : ""
        }
        <button class="modal-button" onclick="fecharModalDetalhesPedido()">Fechar</button>
      </div>
    `;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    if (pedido.status === "Pronto, aguardando envio") {
      // Carrega o valor do frete e produtor no modal
      document.getElementById("frete-pedido").value = pedido.frete || "";
      document.getElementById("produtor-pedido").value = pedido.produtor || "";
    }
  }
  
  // Função para confirmar o valor do frete e produtor do pedido
  function confirmarFreteProdutor(id) {
    let frete = parseFloat(document.getElementById("frete-pedido").value);
    let produtor = document.getElementById("produtor-pedido").value;
    adicionarFreteProdutor(id, frete, produtor);
    fecharModalDetalhesPedido();
  }
  
  // Função para abrir o modal de confirmação de finalização do pedido
  function abrirModalFinalizarPedido(id) {
    let pedido = PEDIDOS[id];
    let modal = document.createElement("div");
    modal.classList.add("modal", "finalizar-pedido-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">Confirmação</h2>
        <p class="modal-text">Você deseja finalizar o pedido nº ${
          pedido.id
        } com o frete de ${pedido.frete} ${pedido.moeda}?</p>
        <button class="modal-button" onclick="confirmarFinalizarPedido(${id})">Sim</button>
        <button class="modal-button" onclick="fecharModalFinalizarPedido()">Não</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para confirmar a finalização do pedido
  function confirmarFinalizarPedido(id) {
    atualizarStatusPedido(id, "Finalizado", null);
    fecharModalFinalizarPedido();
    exibirPedidos();
  }
  
  // Função para fechar o modal de confirmação de finalização do pedido
  function fecharModalFinalizarPedido() {
    let modal = document.querySelector(".finalizar-pedido-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para fechar o modal de detalhes do pedido
  function fecharModalDetalhesPedido() {
    let modal = document.querySelector(".detalhes-pedido-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para adicionar uma nota fiscal ao pedido
  function adicionarNotaFiscal(id) {
    let inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = ".pdf,.jpg,.jpeg";
    inputFile.onchange = () => {
      let file = inputFile.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        PEDIDOS[id].notaFiscal = e.target.result;
        salvarDados();
        fecharModalDetalhesPedido();
        abrirModalDetalhesPedido(id);
      };
      reader.readAsDataURL(file);
    };
    inputFile.click();
  }
  
  // Função para baixar a nota fiscal do pedido
  function baixarNotaFiscal(id) {
    let link = document.createElement("a");
    link.href = PEDIDOS[id].notaFiscal;
    link.download = `nota-fiscal-${PEDIDOS[id].id}.pdf`;
    link.click();
  }
  
  // Função para abrir o modal de alteração de status para "Pronto, aguardando envio"
  function abrirModalAlterarStatus(id) {
    let pedido = PEDIDOS[id];
    let modal = document.createElement("div");
    modal.classList.add("modal", "alterar-status-modal");
    let itensPedido = "";
    let totalRape = 0;
    for (let produto in pedido.itens) {
      if (PRODUTOS.includes(produto)) {
        if (produto === "Rapé") {
          // Adiciona a quantidade de rapé do tipo selecionado
          for (let tipo in pedido.itens[produto]) {
            totalRape += pedido.itens[produto][tipo];
            itensPedido += `
              <tr>
                <td>${produto} ${tipo}</td>
                <td>${pedido.itens[produto][tipo]}Kg (${
              pedido.itens[produto][tipo] * 2
            } Pacotes)</td>
                <td><input type="text" id="lote-${tipo}" class="input" placeholder="Lote (2 dígitos)"></td>
              </tr>
            `;
          }
        } else {
          // Adiciona a quantidade do produto selecionado
          itensPedido += `
            <tr>
              <td>${produto}</td>
              <td>${pedido.itens[produto]} Un.</td>
              <td><input type="text" id="lote-${produto}" class="input" placeholder="Lote (2 dígitos)"></td>
            </tr>
          `;
        }
      }
    }
    let modalContent = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalAlterarStatus()">×</span>
        <h2 class="modal-title">Confirmação</h2>
        <p class="modal-text">Informe os códigos de lote para os tipos de Rapé:</p>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Lote</th>
            </tr>
          </thead>
          <tbody>
            ${itensPedido}
          </tbody>
        </table>
        <button class="modal-button" onclick="confirmarAlterarStatus(${id})">Confirmar</button>
        <button class="modal-button" onclick="fecharModalAlterarStatus()">Cancelar</button>
      </div>
    `;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
  }
  
  // Função para confirmar a alteração do status para "Pronto, aguardando envio"
  function confirmarAlterarStatus(id) {
    let lote = {};
    for (let produto in PEDIDOS[id].itens) {
      if (PRODUTOS.includes(produto)) {
        let loteInput = document.getElementById(`lote-${produto}`);
        if (loteInput) {
          lote[produto] = loteInput.value;
        }
      }
    }
    atualizarStatusPedido(id, "Pronto, aguardando envio", lote);
    fecharModalAlterarStatus();
    exibirPedidos();
  }
  
  // Função para fechar o modal de alteração de status
  function fecharModalAlterarStatus() {
    let modal = document.querySelector(".alterar-status-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Função para pesquisar pedidos
  function pesquisarPedidos() {
    let termoPesquisa = document.getElementById("pesquisa-pedido").value.toLowerCase();
    let pedidosNaoFinalizadosContainer = document.getElementById(
      "pedidos-nao-finalizados"
    );
    let pedidosFinalizadosContainer = document.getElementById(
      "pedidos-finalizados"
    );
    pedidosNaoFinalizadosContainer.innerHTML = "";
    pedidosFinalizadosContainer.innerHTML = "";
    // Ordena os pedidos finalizados por data
    let pedidosFinalizadosOrdenados = Object.entries(PEDIDOS)
      .filter(([_, pedido]) => pedido.status === "Finalizado")
      .sort((a, b) => {
        let dataA = new Date(a[1].data);
        let dataB = new Date(b[1].data);
        return dataB - dataA;
      });
    // Exibe os pedidos não finalizados
    for (let id in PEDIDOS) {
      let pedido = PEDIDOS[id];
      if (
        (pedido.id.toString().includes(termoPesquisa) ||
          CLIENTES[pedido.cliente].nome
            .toLowerCase()
            .includes(termoPesquisa)) &&
        pedido.status !== "Finalizado"
      ) {
        let pedidoContainer = document.createElement("div");
        pedidoContainer.classList.add("pedido-container");
        pedidoContainer.innerHTML = `
          <div class="pedido-resumo">
            <p>Pedido nº: ${pedido.id}</p>
            <p>Cliente: ${CLIENTES[pedido.cliente].nome}</p>
            <p>Status: ${pedido.status}</p>
          </div>
          <button class="modal-button" onclick="abrirModalDetalhesPedido(${id})">Ver Detalhes</button>
        `;
        pedidosNaoFinalizadosContainer.appendChild(pedidoContainer);
      }
    }
    // Exibe os pedidos finalizados (máximo de 5 por página)
    let paginaAtual = parseInt(
      localStorage.getItem("pagina-pedidos-finalizados") || "1"
    );
    let pedidosFinalizados = pedidosFinalizadosOrdenados.slice(
      (paginaAtual - 1) * 5,
      paginaAtual * 5
    );
    pedidosFinalizados.forEach(([id, pedido]) => {
      if (
        (pedido.id.toString().includes(termoPesquisa) ||
          CLIENTES[pedido.cliente].nome
            .toLowerCase()
            .includes(termoPesquisa)) &&
        pedido.status === "Finalizado"
      ) {
        let pedidoContainer = document.createElement("div");
        pedidoContainer.classList.add("pedido-container");
        pedidoContainer.innerHTML = `
          <div class="pedido-resumo">
            <p>Pedido nº: ${pedido.id}</p>
            <p>Cliente: ${CLIENTES[pedido.cliente].nome}</p>
            <p>Status: ${pedido.status}</p>
          </div>
          <button class="modal-button" onclick="abrirModalDetalhesPedido(${id})">Ver Detalhes</button>
        `;
        pedidosFinalizadosContainer.appendChild(pedidoContainer);
      }
    });
    // Adiciona o botão de próxima página se houver mais pedidos finalizados
    if (
      pedidosFinalizadosOrdenados.length > paginaAtual * 5 &&
      paginaAtual <
        Math.ceil(pedidosFinalizadosOrdenados.length / 5)
    ) {
      let proximaPaginaButton = document.createElement("button");
      proximaPaginaButton.classList.add("modal-button");
      proximaPaginaButton.textContent = "Próxima Página";
      proximaPaginaButton.onclick = () => {
        localStorage.setItem(
          "pagina-pedidos-finalizados",
          (paginaAtual + 1).toString()
        );
        exibirPedidos();
      };
      pedidosFinalizadosContainer.appendChild(proximaPaginaButton);
    }
  }
  
  // Carrega as informações na página
  window.onload = () => {
    exibirPedidos();
  };
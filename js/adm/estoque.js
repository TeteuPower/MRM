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
    adicionarRemoverItemEstoque,
    atualizarEstoqueTotal,
    atualizarEstoqueReservado
  } from "../../js/funcoes.js";
  
  // Inicialização
  carregarDados();
  
  // Exibe a quantidade total de rapé disponível no estoque
  function exibirEstoqueRape() {
    let estoqueRape = document.getElementById("estoque-rapee");
    let quantidadeTotal = ESTOQUE.Rapé.total;
    let quantidadePacotes = quantidadeTotal / 0.5;
    estoqueRape.textContent = `Rapé disponível: ${quantidadeTotal}Kg (${quantidadePacotes} Pacotes)`;
    // Verifica se a quantidade está abaixo de 30Kg, entre 30 e 60Kg ou acima de 60Kg
    if (quantidadeTotal < 30) {
      estoqueRape.style.color = "red";
    } else if (quantidadeTotal >= 30 && quantidadeTotal <= 60) {
      estoqueRape.style.color = "yellow";
    } else if (quantidadeTotal > 60) {
      estoqueRape.style.color = "green";
    }
    // Exibe a quantidade de rapé reservado
    if (ESTOQUE.Rapé.reservado > 0) {
      estoqueRape.textContent += ` (${ESTOQUE.Rapé.reservado}Kg reservados)`;
    }
  }
  
  // Exibe a quantidade total de cinzas disponível no estoque
  function exibirEstoqueCinzas() {
    let estoqueCinzas = document.getElementById("estoque-cinzas");
    let quantidadeTotal = ESTOQUE.Cinzas.total;
    estoqueCinzas.textContent = `Cinzas disponíveis: ${quantidadeTotal}Kg`;
    // Verifica se a quantidade está abaixo de 50Kg, entre 50 e 100Kg ou acima de 100Kg
    if (quantidadeTotal < 50) {
      estoqueCinzas.style.color = "red";
    } else if (quantidadeTotal >= 50 && quantidadeTotal <= 100) {
      estoqueCinzas.style.color = "yellow";
    } else if (quantidadeTotal > 100) {
      estoqueCinzas.style.color = "green";
    }
    // Exibe a quantidade de cinzas reservado
    if (ESTOQUE.Cinzas.reservado > 0) {
      estoqueCinzas.textContent += ` (${ESTOQUE.Cinzas.reservado}Kg reservados)`;
    }
  }
  
  // Exibe a quantidade de couripes disponível no estoque
  function exibirEstoqueCouripes() {
    let estoqueCouripes = document.getElementById("estoque-couripes");
    estoqueCouripes.textContent = `Couripes disponíveis: ${
      ESTOQUE.Couripes
    } Un.`;
    // Exibe a quantidade de couripes reservado
    if (ESTOQUE.Couripes.reservado > 0) {
      estoqueCouripes.textContent += ` (${ESTOQUE.Couripes.reservado} Un. reservados)`;
    }
  }
  
  // Exibe a quantidade de sananga disponível no estoque
  function exibirEstoqueSananga() {
    let estoqueSananga = document.getElementById("estoque-sananga");
    let quantidadeTotal = ESTOQUE.Sananga.total;
    let quantidadePacotes = quantidadeTotal / 0.5;
    estoqueSananga.textContent = `Sananga disponível: ${quantidadeTotal}Kg (${quantidadePacotes} Pacotes)`;
    // Exibe a quantidade de sananga reservado
    if (ESTOQUE.Sananga.reservado > 0) {
      estoqueSananga.textContent += ` (${ESTOQUE.Sananga.reservado}Kg reservados)`;
    }
  }
  
  // Exibe a quantidade de artesanatos disponível no estoque
  function exibirEstoqueArtesanatos() {
    let estoqueArtesanatos = document.getElementById("estoque-artesanatos");
    estoqueArtesanatos.textContent = `Artesanatos disponíveis: ${
      ESTOQUE.Artesanatos
    } Un.`;
    // Exibe a quantidade de artesanatos reservado
    if (ESTOQUE.Artesanatos.reservado > 0) {
      estoqueArtesanatos.textContent += ` (${ESTOQUE.Artesanatos.reservado} Un. reservados)`;
    }
  }
  
  // Exibe a quantidade de tabaco disponível no estoque
  function exibirEstoqueTabaco() {
    let estoqueTabaco = document.getElementById("estoque-tabaco");
    let quantidadeTotal = ESTOQUE.Tabaco.total;
    estoqueTabaco.textContent = `Tabaco disponível: ${quantidadeTotal}Kg`;
    // Verifica se a quantidade está abaixo de 30Kg, entre 30 e 60Kg ou acima de 60Kg
    if (quantidadeTotal < 30) {
      estoqueTabaco.style.color = "red";
    } else if (quantidadeTotal >= 30 && quantidadeTotal <= 60) {
      estoqueTabaco.style.color = "yellow";
    } else if (quantidadeTotal > 60) {
      estoqueTabaco.style.color = "green";
    }
    // Exibe a quantidade de tabaco reservado
    if (ESTOQUE.Tabaco.reservado > 0) {
      estoqueTabaco.textContent += ` (${ESTOQUE.Tabaco.reservado}Kg reservados)`;
    }
  }
  
  // Exibe a quantidade de pacotes disponível no estoque
  function exibirEstoquePacotes() {
    let estoquePacotes = document.getElementById("estoque-pacotes");
    estoquePacotes.textContent = `Pacotes disponíveis: ${
      ESTOQUE.Pacotes
    } Un.`;
    // Verifica se a quantidade está abaixo de 80, entre 80 e 150 ou acima de 150
    if (ESTOQUE.Pacotes < 80) {
      estoquePacotes.style.color = "red";
    } else if (ESTOQUE.Pacotes >= 80 && ESTOQUE.Pacotes <= 150) {
      estoquePacotes.style.color = "yellow";
    } else if (ESTOQUE.Pacotes > 150) {
      estoquePacotes.style.color = "green";
    }
    // Exibe a quantidade de pacotes reservado
    if (ESTOQUE.Pacotes.reservado > 0) {
      estoquePacotes.textContent += ` (${ESTOQUE.Pacotes.reservado} Un. reservados)`;
    }
  }
  
  // Exibe a quantidade de adesivos grandes disponível no estoque
  function exibirEstoqueAdesivos() {
    let estoqueAdesivos = document.getElementById("estoque-adesivos");
    estoqueAdesivos.textContent = `Adesivos Grandes disponíveis: ${
      ESTOQUE["Adesivos Grandes"]
    } Un.`;
    // Verifica se a quantidade está abaixo de 80, entre 80 e 150 ou acima de 150
    if (ESTOQUE["Adesivos Grandes"] < 80) {
      estoqueAdesivos.style.color = "red";
    } else if (
      ESTOQUE["Adesivos Grandes"] >= 80 &&
      ESTOQUE["Adesivos Grandes"] <= 150
    ) {
      estoqueAdesivos.style.color = "yellow";
    } else if (ESTOQUE["Adesivos Grandes"] > 150) {
      estoqueAdesivos.style.color = "green";
    }
    // Exibe a quantidade de adesivos reservado
    if (ESTOQUE["Adesivos Grandes"].reservado > 0) {
      estoqueAdesivos.textContent += ` (${ESTOQUE["Adesivos Grandes"].reservado} Un. reservados)`;
    }
  }
  
  // Cria o modal para exibir as variedades de rapé
  function exibirVariedadesRape() {
    let modal = document.createElement("div");
    modal.classList.add("modal", "estoque-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">Variedades de Rapé</h2>
        <ul class="modal-list">
          ${RAPES.map((tipo) => `<li>${tipo}</li>`).join("")}
        </ul>
        <button class="modal-button" onclick="fecharModalEstoque()">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Cria o modal para exibir as variedades de cinzas
  function exibirVariedadesCinzas() {
    let modal = document.createElement("div");
    modal.classList.add("modal", "estoque-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">Variedades de Cinzas</h2>
        <ul class="modal-list">
          ${CINZAS.map((tipo) => `<li>${tipo}</li>`).join("")}
        </ul>
        <button class="modal-button" onclick="fecharModalEstoque()">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Adiciona a quantidade de rapé ao estoque
  function adicionarRape() {
    let quantidade = parseInt(document.getElementById("quantidade-rapee").value);
    let tipo = document.getElementById("tipo-rapee").value;
    adicionarRemoverItemEstoque("Rapé", quantidade, tipo, "adicionar", null);
  }
  
  // Remove a quantidade de rapé do estoque
  function removerRape() {
    let quantidade = parseInt(document.getElementById("quantidade-rapee").value);
    let tipo = document.getElementById("tipo-rapee").value;
    adicionarRemoverItemEstoque("Rapé", quantidade, tipo, "subtrair", null);
  }
  
  // Adiciona a quantidade de couripes ao estoque
  function adicionarCouripes() {
    let quantidade = parseInt(document.getElementById("quantidade-couripes").value);
    adicionarRemoverItemEstoque("Couripes", quantidade, null, "adicionar", null);
  }
  
  // Remove a quantidade de couripes do estoque
  function removerCouripes() {
    let quantidade = parseInt(document.getElementById("quantidade-couripes").value);
    adicionarRemoverItemEstoque("Couripes", quantidade, null, "subtrair", null);
  }
  
  // Adiciona a quantidade de sananga ao estoque
  function adicionarSananga() {
    let quantidade = parseInt(document.getElementById("quantidade-sananga").value);
    adicionarRemoverItemEstoque("Sananga", quantidade, null, "adicionar", null);
  }
  
  // Remove a quantidade de sananga do estoque
  function removerSananga() {
    let quantidade = parseInt(document.getElementById("quantidade-sananga").value);
    adicionarRemoverItemEstoque("Sananga", quantidade, null, "subtrair", null);
  }
  
  // Adiciona a quantidade de artesanatos ao estoque
  function adicionarArtesanatos() {
    let quantidade = parseInt(
      document.getElementById("quantidade-artesanatos").value
    );
    adicionarRemoverItemEstoque(
      "Artesanatos",
      quantidade,
      null,
      "adicionar",
      null
    );
  }
  
  // Remove a quantidade de artesanatos do estoque
  function removerArtesanatos() {
    let quantidade = parseInt(
      document.getElementById("quantidade-artesanatos").value
    );
    adicionarRemoverItemEstoque(
      "Artesanatos",
      quantidade,
      null,
      "subtrair",
      null
    );
  }
  
  // Adiciona a quantidade de tabaco ao estoque
  function adicionarTabaco() {
    let quantidade = parseInt(document.getElementById("quantidade-tabaco").value);
    adicionarRemoverItemEstoque("Tabaco", quantidade, null, "adicionar", null);
  }
  
  // Remove a quantidade de tabaco do estoque
  function removerTabaco() {
    let quantidade = parseInt(document.getElementById("quantidade-tabaco").value);
    adicionarRemoverItemEstoque("Tabaco", quantidade, null, "subtrair", null);
  }
  
  // Adiciona a quantidade de cinzas ao estoque
  function adicionarCinzas() {
    let quantidade = parseInt(document.getElementById("quantidade-cinzas").value);
    let tipo = document.getElementById("tipo-cinzas").value;
    adicionarRemoverItemEstoque("Cinzas", quantidade, tipo, "adicionar", null);
  }
  
  // Remove a quantidade de cinzas do estoque
  function removerCinzas() {
    let quantidade = parseInt(document.getElementById("quantidade-cinzas").value);
    let tipo = document.getElementById("tipo-cinzas").value;
    adicionarRemoverItemEstoque("Cinzas", quantidade, tipo, "subtrair", null);
  }
  
  // Adiciona a quantidade de pacotes ao estoque
  function adicionarPacotes() {
    let quantidade = parseInt(document.getElementById("quantidade-pacotes").value);
    adicionarRemoverItemEstoque("Pacotes", quantidade, null, "adicionar", null);
  }
  
  // Remove a quantidade de pacotes do estoque
  function removerPacotes() {
    let quantidade = parseInt(document.getElementById("quantidade-pacotes").value);
    adicionarRemoverItemEstoque("Pacotes", quantidade, null, "subtrair", null);
  }
  
  // Adiciona a quantidade de adesivos grandes ao estoque
  function adicionarAdesivos() {
    let quantidade = parseInt(
      document.getElementById("quantidade-adesivos").value
    );
    adicionarRemoverItemEstoque(
      "Adesivos Grandes",
      quantidade,
      null,
      "adicionar",
      null
    );
  }
  
  // Remove a quantidade de adesivos grandes do estoque
  function removerAdesivos() {
    let quantidade = parseInt(
      document.getElementById("quantidade-adesivos").value
    );
    adicionarRemoverItemEstoque(
      "Adesivos Grandes",
      quantidade,
      null,
      "subtrair",
      null
    );
  }
  
  // Carrega as informações do estoque na página
  window.onload = () => {
    // Exibe as informações do estoque
    exibirEstoqueRape();
    exibirEstoqueCinzas();
    exibirEstoqueCouripes();
    exibirEstoqueSananga();
    exibirEstoqueArtesanatos();
    exibirEstoqueTabaco();
    exibirEstoquePacotes();
    exibirEstoqueAdesivos();
  
    // Adiciona os tipos de rapé à lista
    let selectRape = document.getElementById("tipo-rapee");
    RAPES.forEach((tipo) => {
      let option = document.createElement("option");
      option.value = tipo;
      option.textContent = tipo;
      selectRape.appendChild(option);
    });
  
    // Adiciona os tipos de cinzas à lista
    let selectCinzas = document.getElementById("tipo-cinzas");
    CINZAS.forEach((tipo) => {
      let option = document.createElement("option");
      option.value = tipo;
      option.textContent = tipo;
      selectCinzas.appendChild(option);
    });
  };
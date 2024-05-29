// Seleciona os elementos do DOM
const formNovaVenda = document.getElementById("form-nova-venda");
const selectCliente = document.getElementById("cliente");
const selectVendedor = document.getElementById("vendedor");
const btnAdicionarProduto = document.getElementById("btn-adicionar-produto");
const tabelaCarrinho = document
  .getElementById("tabela-carrinho")
  .querySelector("tbody");
const resumoRape = document.getElementById("resumo-rape");
const selectMoeda = document.getElementById("moeda");
const inputValorVenda = document.getElementById("valor-venda");
const inputValorPago = document.getElementById("valor-pago");
const saldoVenda = document.getElementById("saldo-venda");
const textareaDescricao = document.getElementById("descricao");

const modalAdicionarProduto = document.getElementById(
  "modal-adicionar-produto"
);
const spanClose = document.getElementsByClassName("close")[2]; // Terceiro elemento com a classe "close"
const formAdicionarProduto = document.getElementById("form-adicionar-produto");
const selectProduto = document.getElementById("produto");
const divOpcoesProduto = document.getElementById("opcoes-produto");
const inputQuantidadeProduto = document.getElementById("quantidade-produto");

let itensCarrinho = [];

// Função para atualizar o select de clientes
function atualizarSelectCliente() {
  selectCliente.innerHTML = "";
  clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nome;
    selectCliente.appendChild(option);
  });
}

// Função para adicionar um produto ao carrinho
function adicionarProdutoCarrinho(produto, tipo, quantidade) {
  itensCarrinho.push({
    produto: produto,
    tipo: tipo,
    quantidade: quantidade,
  });
  atualizarCarrinho();
}

// Função para remover um produto do carrinho
function removerProdutoCarrinho(index) {
  itensCarrinho.splice(index, 1);
  atualizarCarrinho();
}

// Função para atualizar a exibição do carrinho
function atualizarCarrinho() {
  tabelaCarrinho.innerHTML = "";
  let quantidadeTotalRape = 0;
  itensCarrinho.forEach((item, index) => {
    const row = document.createElement("tr");
    const cellProduto = document.createElement("td");
    const cellQuantidade = document.createElement("td");
    const cellAcoes = document.createElement("td");

    if (item.produto === "Rapé") {
      cellProduto.textContent = `Rapé ${item.tipo} ${item.quantidade}Kg (${
        item.quantidade * 2
      } Pacotes)`;
      quantidadeTotalRape += item.quantidade;
    } else {
      cellProduto.textContent = `${item.produto} ${item.quantidade} ${
        item.produto === "Couripes" || item.produto === "Artesanatos"
          ? "Un."
          : "Kg"
      }`;
    }
    cellQuantidade.textContent = item.quantidade;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.classList.add("btn-3d", "btn-vermelho", "btn-remover-produto");
    btnRemover.addEventListener("click", function () {
      removerProdutoCarrinho(index);
    });
    cellAcoes.appendChild(btnRemover);

    row.appendChild(cellProduto);
    row.appendChild(cellQuantidade);
    row.appendChild(cellAcoes);
    tabelaCarrinho.appendChild(row);
  });

  if (quantidadeTotalRape > 0) {
    resumoRape.textContent = `Quantidade total de rapé: ${quantidadeTotalRape}Kg (${
      quantidadeTotalRape * 2
    } pacotes)`;
  } else {
    resumoRape.textContent = "";
  }

  atualizarSaldoVenda();
}

// Função para atualizar o saldo da venda
function atualizarSaldoVenda() {
  const valorVenda = parseFloat(inputValorVenda.value) || 0;
  const valorPago = parseFloat(inputValorPago.value) || 0;
  const saldo = valorPago - valorVenda;
  const moeda = selectMoeda.value === "real" ? "R$" : "US$";
  saldoVenda.textContent = `Saldo da venda: ${moeda} ${saldo.toFixed(2)}`;
}

// Adiciona evento de clique ao botão "Adicionar Produto"
btnAdicionarProduto.addEventListener("click", function () {
  modalAdicionarProduto.style.display = "block";
});

// Adiciona evento de clique ao botão de fechar do modal
spanClose.addEventListener("click", function () {
  modalAdicionarProduto.style.display = "none";
});

// Adiciona evento de mudança ao select de produto
selectProduto.addEventListener("change", function () {
  const produtoSelecionado = selectProduto.value;
  divOpcoesProduto.innerHTML = "";
  inputQuantidadeProduto.value = "";
  if (produtoSelecionado === "Rapé") {
    const selectTipoRape = criarSelectTipos("Rapé");
    divOpcoesProduto.appendChild(selectTipoRape);
  }
});

// Adiciona evento de submit ao formulário de adicionar produto
formAdicionarProduto.addEventListener("submit", function (event) {
  event.preventDefault();
  const produto = selectProduto.value;
  const quantidade = parseInt(inputQuantidadeProduto.value);
  let tipo = null;
  if (produto === "Rapé") {
    const selectTipoRape = divOpcoesProduto.querySelector("select");
    tipo = selectTipoRape.value;
  }
  adicionarProdutoCarrinho(produto, tipo, quantidade);
  modalAdicionarProduto.style.display = "none";
});

// Adiciona evento de mudança aos inputs de valor da venda e valor pago
inputValorVenda.addEventListener("change", atualizarSaldoVenda);
inputValorPago.addEventListener("change", atualizarSaldoVenda);

// Adiciona evento de submit ao formulário de nova venda
formNovaVenda.addEventListener("submit", function (event) {
  event.preventDefault();
  const clienteId = parseInt(selectCliente.value);
  const vendedor = selectVendedor.value;
  const valorVenda = parseFloat(inputValorVenda.value);
  const valorPago = parseFloat(inputValorPago.value);
  const descricao = textareaDescricao.value;

  const cliente = clientes.find((cliente) => cliente.id === clienteId);

  if (confirm("Deseja realmente finalizar a venda?")) {
    adicionarPedido(
      cliente,
      vendedor,
      itensCarrinho,
      valorVenda,
      valorPago,
      descricao,
      "administrador"
    );

    // Atualiza o saldo do cliente
    const moeda = selectMoeda.value;
    if (moeda === "real") {
      cliente.saldoReal += valorPago - valorVenda;
    } else if (moeda === "dolar") {
      cliente.saldoDolar += valorPago - valorVenda;
    }
    salvarDados();

    // Limpa o formulário e o carrinho
    formNovaVenda.reset();
    itensCarrinho = [];
    atualizarCarrinho();
  }
});

// Atualiza o select de clientes ao carregar a página
atualizarSelectCliente();
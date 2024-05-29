// Seleciona os elementos do DOM
const inputPesquisa = document.getElementById("pesquisa");
const listaPedidosNaoFinalizados = document.getElementById("lista-pedidos-nao-finalizados");
const listaPedidosFinalizados = document.getElementById("lista-pedidos-finalizados");

const modalDetalhesPedido = document.getElementById("modal-detalhes-pedido");
const modalTitulo = document.getElementById("modal-titulo");
const modalConteudo = document.getElementById("modal-conteudo");
const spanClose = document.getElementsByClassName("close")[3]; // Quarto elemento com a classe "close"

// Função para atualizar a lista de pedidos
function atualizarListaPedidos() {
    listaPedidosNaoFinalizados.innerHTML = "";
    listaPedidosFinalizados.innerHTML = "";

    pedidos.forEach(pedido => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>Pedido nº ${pedido.id}</strong><br>
            Cliente: ${pedido.cliente.nome}<br>
            Status: ${pedido.status}
        `;

        const btnVerDetalhes = document.createElement("button");
        btnVerDetalhes.textContent = "Ver Detalhes";
        btnVerDetalhes.classList.add("btn-3d", "btn-verde");
        btnVerDetalhes.addEventListener("click", function() {
            exibirDetalhesPedido(pedido);
        });
        li.appendChild(btnVerDetalhes);

        if (pedido.status === "Finalizado") {
            listaPedidosFinalizados.appendChild(li);
        } else {
            listaPedidosNaoFinalizados.appendChild(li);
        }
    });
}

// Função para exibir os detalhes do pedido no modal
function exibirDetalhesPedido(pedido) {
    modalTitulo.textContent = `Detalhes do Pedido nº ${pedido.id}`;
    modalConteudo.innerHTML = `
        <p><strong>Número do Pedido:</strong> ${pedido.id}</p>
        <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
        <p><strong>Vendedor:</strong> ${pedido.vendedor}</p>
        <p><strong>Descrição/Comentários:</strong> ${pedido.descricao}</p>
        <p><strong>Data de Criação:</strong> ${pedido.dataCriacao.toLocaleString()}</p>
        <p><strong>Valor da Venda:</strong> ${pedido.valor}</p>
        <p><strong>Valor Pago:</strong> ${pedido.valorPago}</p>
        <p><strong>Status:</strong> ${pedido.status}</p>
        <p><strong>Itens do Pedido:</strong></p>
        <ul>
            ${pedido.itens.map(item => `<li>${item.produto} ${item.tipo ? item.tipo + ' ' : ''}${item.quantidade} ${item.produto === "Couripes" || item.produto === "Artesanatos" ? 'Un.' : 'Kg'}</li>`).join('')}
        </ul>
        <p><strong>Solicitado por:</strong> ${pedido.solicitadoPor}</p>
    `;

    // Adiciona botões de ação ao modal, se necessário
    const botoesAcao = document.createElement("div");
    botoesAcao.classList.add("botoes-acao");
    if (pedido.status === "Em produção") {
        const btnProntoAguardandoEnvio = document.createElement("button");
        btnProntoAguardandoEnvio.textContent = "Pronto, Aguardando Envio";
        btnProntoAguardandoEnvio.classList.add("btn-3d", "btn-laranja");
        btnProntoAguardandoEnvio.addEventListener("click", function() {
            if (confirm("Deseja realmente alterar o status do pedido para 'Pronto, Aguardando Envio'?")) {
                atualizarStatusPedido(pedido.id, "Pronto, Aguardando Envio");
                atualizarEstoqueAoAtualizarStatus(pedido.itens, "subtrair");
                atualizarListaPedidos();
                modalDetalhesPedido.style.display = "none";
            }
        });
        botoesAcao.appendChild(btnProntoAguardandoEnvio);
    } else if (pedido.status === "Pronto, Aguardando Envio") {
        // Adiciona campo para inserir o valor do frete
        modalConteudo.innerHTML += `
            <div class="input-group">
                <label for="valor-frete">Valor do Frete:</label>
                <input type="number" id="valor-frete" min="0" step="0.01" required>
            </div>
        `;

        const btnFinalizarPedido = document.createElement("button");
        btnFinalizarPedido.textContent = "Finalizar Pedido";
        btnFinalizarPedido.classList.add("btn-3d", "btn-verde");
        btnFinalizarPedido.addEventListener("click", function() {
            const valorFrete = parseFloat(document.getElementById("valor-frete").value);
            if (confirm(`Deseja realmente finalizar o pedido? O valor do frete será de: R$ ${valorFrete.toFixed(2)}`)) {
                atualizarStatusPedido(pedido.id, "Finalizado");
                atualizarListaPedidos();
                modalDetalhesPedido.style.display = "none";
            }
        });
        botoesAcao.appendChild(btnFinalizarPedido);
    }
    modalConteudo.appendChild(botoesAcao);

    modalDetalhesPedido.style.display = "block";
}

// Função para atualizar o estoque ao atualizar o status do pedido
function atualizarEstoqueAoAtualizarStatus(itens, acao) {
    itens.forEach(item => {
        const produto = item.produto.toLowerCase();
        const quantidade = item.quantidade;

        if (acao === "subtrair") {
            estoque.produtos[produto].total -= quantidade;
            if (produto === "rape") {
                estoque.produtos.rape.tipos[item.tipo] -= quantidade;
            }
        } else if (acao === "adicionar") {
            estoque.produtos[produto].total += quantidade;
            if (produto === "rape") {
                estoque.produtos.rape.tipos[item.tipo] += quantidade;
            }
        }
    });
    salvarDados();
    atualizarEstoque();
}

// Adiciona evento de clique ao botão de fechar do modal
spanClose.addEventListener("click", function() {
    modalDetalhesPedido.style.display = "none";
});

// Adiciona evento de input ao campo de pesquisa
inputPesquisa.addEventListener("input", function() {
    const termoPesquisa = inputPesquisa.value.toLowerCase();
    const lis = listaPedidosNaoFinalizados.querySelectorAll("li");
    lis.forEach(li => {
        const conteudoLi = li.textContent.toLowerCase();
        if (conteudoLi.includes(termoPesquisa)) {
            li.style.display = "block";
        } else {
            li.style.display = "none";
        }
    });
});

// Atualiza a lista de pedidos ao carregar a página
atualizarListaPedidos();

// Navegação entre Páginas

// Seleciona os botões de navegação
const botoesPagina = document.querySelectorAll(".btn-pagina");

// Adiciona evento de clique aos botões de navegação
botoesPagina.forEach(botao => {
    botao.addEventListener("click", function() {
        const pagina = botao.dataset.pagina;
        window.location.href = `${pagina}.html`;
    });
});
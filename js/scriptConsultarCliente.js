// Seleciona os elementos do DOM
const inputPesquisaCliente = document.getElementById("pesquisa-cliente");
const listaClientes = document.getElementById("lista-clientes");
const modalDetalhesCliente = document.getElementById("modal-detalhes-cliente");
const modalTitulo = document.getElementById("modal-titulo");
const modalConteudo = document.getElementById("modal-conteudo");
const spanClose = document.getElementsByClassName("close")[4]; // Quinto elemento com a classe "close"

// Função para atualizar a lista de clientes
function atualizarListaClientes() {
    listaClientes.innerHTML = "";
    clientes.forEach(cliente => {
        const li = document.createElement("li");
        li.textContent = cliente.nome;
        li.addEventListener("click", function() {
            exibirDetalhesCliente(cliente);
        });
        listaClientes.appendChild(li);
    });
}

// Função para exibir os detalhes do cliente no modal
function exibirDetalhesCliente(cliente) {
    modalTitulo.textContent = `Detalhes do Cliente: ${cliente.nome}`;
    modalConteudo.innerHTML = `
        <p><strong>Nome:</strong> ${cliente.nome}</p>
        <p><strong>E-mail:</strong> ${cliente.email}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <p><strong>Endereço:</strong> ${cliente.endereco}</p>
        <p><strong>Saldo (Real):</strong> R$ ${cliente.saldoReal.toFixed(2)}</p>
        <p><strong>Saldo (Dólar):</strong> US$ ${cliente.saldoDolar.toFixed(2)}</p>
        <h3>Histórico de Pedidos:</h3>
        <ul>
            ${pedidos.filter(pedido => pedido.cliente.id === cliente.id)
                .map(pedido => `
                    <li>
                        <strong>Pedido nº ${pedido.id}</strong><br>
                        Data: ${pedido.dataCriacao.toLocaleDateString()}<br>
                        Valor: R$ ${pedido.valor.toFixed(2)}<br>
                        Status: ${pedido.status}
                    </li>
                `).join('')}
        </ul>
    `;
    modalDetalhesCliente.style.display = "block";
}

// Adiciona evento de clique ao botão de fechar do modal
spanClose.addEventListener("click", function() {
    modalDetalhesCliente.style.display = "none";
});

// Adiciona evento de input ao campo de pesquisa
inputPesquisaCliente.addEventListener("input", function() {
    const termoPesquisa = inputPesquisaCliente.value.toLowerCase();
    const lis = listaClientes.querySelectorAll("li");
    lis.forEach(li => {
        const conteudoLi = li.textContent.toLowerCase();
        if (conteudoLi.includes(termoPesquisa)) {
            li.style.display = "block";
        } else {
            li.style.display = "none";
        }
    });
});

// Atualiza a lista de clientes ao carregar a página
atualizarListaClientes();

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
// Seleciona os elementos do DOM
const listaVendedores = document.getElementById("lista-vendedores");
const inputNovoVendedor = document.getElementById("novo-vendedor");
const btnAdicionarVendedor = document.getElementById("btn-adicionar-vendedor");

const listaProdutores = document.getElementById("lista-produtores");
const inputNovoProdutor = document.getElementById("novo-produtor");
const btnAdicionarProdutor = document.getElementById("btn-adicionar-produtor");

// Função para atualizar a lista de vendedores
function atualizarListaVendedores() {
    listaVendedores.innerHTML = "";
    vendedores.forEach((vendedor, index) => {
        const li = document.createElement("li");
        li.textContent = vendedor;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.classList.add("btn-3d", "btn-vermelho");
        btnRemover.addEventListener("click", function() {
            if (confirm(`Deseja realmente remover o vendedor "${vendedor}"?`)) {
                vendedores.splice(index, 1);
                salvarDados();
                atualizarListaVendedores();
            }
        });
        li.appendChild(btnRemover);

        listaVendedores.appendChild(li);
    });
}

// Função para atualizar a lista de produtores
function atualizarListaProdutores() {
    listaProdutores.innerHTML = "";
    produtores.forEach((produtor, index) => {
        const li = document.createElement("li");
        li.textContent = produtor;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.classList.add("btn-3d", "btn-vermelho");
        btnRemover.addEventListener("click", function() {
            if (confirm(`Deseja realmente remover o produtor "${produtor}"?`)) {
                produtores.splice(index, 1);
                salvarDados();
                atualizarListaProdutores();
            }
        });
        li.appendChild(btnRemover);

        listaProdutores.appendChild(li);
    });
}

// Adiciona evento de clique ao botão "Adicionar Vendedor"
btnAdicionarVendedor.addEventListener("click", function() {
    const novoVendedor = inputNovoVendedor.value.trim();
    if (novoVendedor !== "") {
        vendedores.push(novoVendedor);
        salvarDados();
        atualizarListaVendedores();
        inputNovoVendedor.value = "";
    }
});

// Adiciona evento de clique ao botão "Adicionar Produtor"
btnAdicionarProdutor.addEventListener("click", function() {
    const novoProdutor = inputNovoProdutor.value.trim();
    if (novoProdutor !== "") {
        produtores.push(novoProdutor);
        salvarDados();
        atualizarListaProdutores();
        inputNovoProdutor.value = "";
    }
});

// Atualiza as listas ao carregar a página
atualizarListaVendedores();
atualizarListaProdutores();

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
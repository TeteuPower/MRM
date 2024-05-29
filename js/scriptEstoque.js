// Seleciona os elementos do DOM
const rapeDisponivel = document.getElementById("rape-disponivel");
const couripesDisponiveis = document.getElementById("couripes-disponiveis");
const sanangaDisponivel = document.getElementById("sananga-disponivel");
const artesanatosDisponiveis = document.getElementById("artesanatos-disponiveis");
const tabacoDisponivel = document.getElementById("tabaco-disponivel");
const cinzasDisponiveis = document.getElementById("cinzas-disponiveis");
const pacotesDisponiveis = document.getElementById("pacotes-disponiveis");
const adesivosGrandesDisponiveis = document.getElementById("adesivos-grandes-disponiveis");

const exibirVariedadesRape = document.getElementById("exibir-variedades-rape");
const exibirVariedadesCinzas = document.getElementById("exibir-variedades-cinzas");
const modalVariedades = document.getElementById("modal-variedades");
const modalTitulo = document.getElementById("modal-titulo");
const modalConteudo = document.getElementById("modal-conteudo");
const spanClose = document.getElementsByClassName("close")[1]; // Segundo elemento com a classe "close"

// Função para atualizar a exibição do estoque
function atualizarEstoque() {
    // Produtos Disponíveis
    const rapeTotal = estoque.produtos.rape.total;
    const rapeReservado = estoque.produtos.rape.reservado;
    const rapeDisponivelCalculado = rapeTotal - rapeReservado;
    rapeDisponivel.textContent = `Rapé disponível: ${rapeDisponivelCalculado}Kg (${rapeDisponivelCalculado * 2} Pacotes) (Reservado: ${rapeReservado}Kg)`;
    if (rapeDisponivelCalculado < 30) {
        rapeDisponivel.style.color = "red";
    } else if (rapeDisponivelCalculado >= 30 && rapeDisponivelCalculado <= 60) {
        rapeDisponivel.style.color = "yellow";
    } else {
        rapeDisponivel.style.color = "green";
    }

    couripesDisponiveis.textContent = `Couripes disponíveis: ${estoque.produtos.couripes.total - estoque.produtos.couripes.reservado} Un. (Reservado: ${estoque.produtos.couripes.reservado} Un.)`;
    sanangaDisponivel.textContent = `Sananga disponível: ${estoque.produtos.sananga.total - estoque.produtos.sananga.reservado}Kg (${(estoque.produtos.sananga.total - estoque.produtos.sananga.reservado) * 2} Pacotes) (Reservado: ${estoque.produtos.sananga.reservado}Kg)`;
    artesanatosDisponiveis.textContent = `Artesanatos disponíveis: ${estoque.produtos.artesanatos.total - estoque.produtos.artesanatos.reservado} Un. (Reservado: ${estoque.produtos.artesanatos.reservado} Un.)`;

    // Matérias-Primas
    tabacoDisponivel.textContent = `Tabaco: ${estoque.materiasPrimas.tabaco.total}Kg`;
    if (estoque.materiasPrimas.tabaco.total < 30) {
        tabacoDisponivel.style.color = "red";
    } else if (estoque.materiasPrimas.tabaco.total >= 30 && estoque.materiasPrimas.tabaco.total <= 60) {
        tabacoDisponivel.style.color = "yellow";
    } else {
        tabacoDisponivel.style.color = "green";
    }

    cinzasDisponiveis.textContent = `Cinzas: ${estoque.materiasPrimas.cinzas.total}Kg`;
    if (estoque.materiasPrimas.cinzas.total < 50) {
        cinzasDisponiveis.style.color = "red";
    } else if (estoque.materiasPrimas.cinzas.total >= 50 && estoque.materiasPrimas.cinzas.total <= 100) {
        cinzasDisponiveis.style.color = "yellow";
    } else {
        cinzasDisponiveis.style.color = "green";
    }

    pacotesDisponiveis.textContent = `Pacotes: ${estoque.materiasPrimas.pacotes.total} Un.`;
    if (estoque.materiasPrimas.pacotes.total < 80) {
        pacotesDisponiveis.style.color = "red";
    } else if (estoque.materiasPrimas.pacotes.total >= 80 && estoque.materiasPrimas.pacotes.total <= 150) {
        pacotesDisponiveis.style.color = "yellow";
    } else {
        pacotesDisponiveis.style.color = "green";
    }

    adesivosGrandesDisponiveis.textContent = `Adesivos Grandes: ${estoque.materiasPrimas.adesivosGrandes.total} Un.`;
    if (estoque.materiasPrimas.adesivosGrandes.total < 80) {
        adesivosGrandesDisponiveis.style.color = "red";
    } else if (estoque.materiasPrimas.adesivosGrandes.total >= 80 && estoque.materiasPrimas.adesivosGrandes.total <= 150) {
        adesivosGrandesDisponiveis.style.color = "yellow";
    } else {
        adesivosGrandesDisponiveis.style.color = "green";
    }
}

// Função para exibir as variedades de rapé no modal
function exibirVariedades(tipo) {
    modalTitulo.textContent = `Variedades de ${tipo}`;
    modalConteudo.innerHTML = "";
    let variedades;
    if (tipo === "Rapé") {
        variedades = estoque.produtos.rape.tipos;
    } else if (tipo === "Cinzas") {
        variedades = estoque.materiasPrimas.cinzas.tipos;
    }
    for (const tipo in variedades) {
        const quantidade = variedades[tipo];
        const item = document.createElement("p");
        item.textContent = `${tipo}: ${quantidade}Kg`;
        modalConteudo.appendChild(item);
    }
    modalVariedades.style.display = "block";
}

// Adiciona evento de clique ao botão "Exibir Variedades" de rapé
exibirVariedadesRape.addEventListener("click", function() {
    exibirVariedades("Rapé");
});

// Adiciona evento de clique ao botão "Exibir Variedades" de cinzas
exibirVariedadesCinzas.addEventListener("click", function() {
    exibirVariedades("Cinzas");
});

// Adiciona evento de clique ao botão de fechar do modal
spanClose.addEventListener("click", function() {
    modalVariedades.style.display = "none";
});

// Atualiza a exibição do estoque ao carregar a página
atualizarEstoque();
// ... (Continuação do código js/scriptEstoque.js)

// Manipulação de Estoque

// Função para criar um input de quantidade
function criarInputQuantidade(tipo) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.required = true;
    input.classList.add("input-quantidade");
    if (tipo === "Kg") {
        input.placeholder = "Quantidade em Kg";
    } else if (tipo === "Unidades") {
        input.placeholder = "Quantidade em Unidades";
    }
    return input;
}

// Função para criar botões de adicionar e reduzir
function criarBotoesAdicionarReduzir(produto, tipo) {
    const divBotoes = document.createElement("div");
    divBotoes.classList.add("botoes-adicionar-reduzir");

    const btnAdicionar = document.createElement("button");
    btnAdicionar.textContent = "Adicionar";
    btnAdicionar.classList.add("btn-3d", "btn-verde");
    btnAdicionar.addEventListener("click", function() {
        const inputQuantidade = btnAdicionar.parentElement.previousElementSibling;
        const quantidade = parseInt(inputQuantidade.value);
        if (confirmarAlteracao("adicionar", produto, quantidade, tipo)) {
            adicionarAoEstoque(produto, quantidade, tipo);
        }
    });

    const btnReduzir = document.createElement("button");
    btnReduzir.textContent = "Reduzir";
    btnReduzir.classList.add("btn-3d", "btn-vermelho");
    btnReduzir.addEventListener("click", function() {
        const inputQuantidade = btnReduzir.parentElement.previousElementSibling;
        const quantidade = parseInt(inputQuantidade.value);
        if (confirmarAlteracao("reduzir", produto, quantidade, tipo)) {
            reduzirDoEstoque(produto, quantidade, tipo);
        }
    });

    divBotoes.appendChild(btnAdicionar);
    divBotoes.appendChild(btnReduzir);
    return divBotoes;
}

// Função para criar um select com os tipos de rapé ou cinzas
function criarSelectTipos(tipo) {
    const select = document.createElement("select");
    select.required = true;
    let tipos;
    if (tipo === "Rapé") {
        tipos = Object.keys(estoque.produtos.rape.tipos);
    } else if (tipo === "Cinzas") {
        tipos = Object.keys(estoque.materiasPrimas.cinzas.tipos);
    }
    tipos.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
    return select;
}

// Função para adicionar um item ao estoque
function adicionarAoEstoque(produto, quantidade, tipo) {
    if (tipo === "Kg") {
        estoque.produtos[produto.toLowerCase()].total += quantidade;
        if (produto === "Rapé") {
            const selectTipo = document.querySelector("#subsecao-rape select");
            const tipoSelecionado = selectTipo.value;
            estoque.produtos.rape.tipos[tipoSelecionado] += quantidade;
        }
    } else if (tipo === "Unidades") {
        estoque.produtos[produto.toLowerCase()].total += quantidade;
    } else {
        estoque[tipo.toLowerCase()][produto.toLowerCase()].total += quantidade;
        if (produto === "Cinzas") {
            const selectTipo = document.querySelector("#subsecao-cinzas select");
            const tipoSelecionado = selectTipo.value;
            estoque.materiasPrimas.cinzas.tipos[tipoSelecionado] += quantidade;
        }
    }
    salvarDados();
    atualizarEstoque();
    exibirMensagem(`Adicionado ${quantidade} ${tipo === "Kg" ? "Kg" : "Unidades"} de ${produto} ao estoque.`);
}

// Função para reduzir um item do estoque
function reduzirDoEstoque(produto, quantidade, tipo) {
    if (tipo === "Kg") {
        estoque.produtos[produto.toLowerCase()].total -= quantidade;
        if (produto === "Rapé") {
            const selectTipo = document.querySelector("#subsecao-rape select");
            const tipoSelecionado = selectTipo.value;
            estoque.produtos.rape.tipos[tipoSelecionado] -= quantidade;
        }
    } else if (tipo === "Unidades") {
        estoque.produtos[produto.toLowerCase()].total -= quantidade;
    } else {
        estoque[tipo.toLowerCase()][produto.toLowerCase()].total -= quantidade;
        if (produto === "Cinzas") {
            const selectTipo = document.querySelector("#subsecao-cinzas select");
            const tipoSelecionado = selectTipo.value;
            estoque.materiasPrimas.cinzas.tipos[tipoSelecionado] -= quantidade;
        }
    }
    salvarDados();
    atualizarEstoque();
    exibirMensagem(`Reduzido ${quantidade} ${tipo === "Kg" ? "Kg" : "Unidades"} de ${produto} do estoque.`);
}

// Função para confirmar a alteração no estoque
function confirmarAlteracao(acao, produto, quantidade, tipo) {
    let mensagem = "";
    if (acao === "adicionar") {
        mensagem = `Deseja realmente adicionar ${quantidade} ${tipo === "Kg" ? "Kg" : "Unidades"} de ${produto} ao estoque?`;
    } else if (acao === "reduzir") {
        mensagem = `Deseja realmente reduzir ${quantidade} ${tipo === "Kg" ? "Kg" : "Unidades"} de ${produto} do estoque?`;
    }
    return confirm(mensagem);
}

// Criação das subseções de manipulação de estoque
const subsecaoProdutos = document.getElementById("subsecao-produtos");
const subsecaoInsumos = document.getElementById("subsecao-insumos");

// Rapé
const subsecaoRape = document.createElement("div");
subsecaoRape.id = "subsecao-rape";
subsecaoRape.innerHTML = "<h4>Rapé</h4>";
subsecaoRape.appendChild(criarInputQuantidade("Kg"));
subsecaoRape.appendChild(criarSelectTipos("Rapé"));
subsecaoRape.appendChild(criarBotoesAdicionarReduzir("Rapé", "Kg"));
subsecaoProdutos.appendChild(subsecaoRape);

// Couripes
const subsecaoCouripes = document.createElement("div");
subsecaoCouripes.id = "subsecao-couripes";
subsecaoCouripes.innerHTML = "<h4>Couripes</h4>";
subsecaoCouripes.appendChild(criarInputQuantidade("Unidades"));
subsecaoCouripes.appendChild(criarBotoesAdicionarReduzir("Couripes", "Unidades"));
subsecaoProdutos.appendChild(subsecaoCouripes);

// Sananga
const subsecaoSananga = document.createElement("div");
subsecaoSananga.id = "subsecao-sananga";
subsecaoSananga.innerHTML = "<h4>Sananga</h4>";
subsecaoSananga.appendChild(criarInputQuantidade("Kg"));
subsecaoSananga.appendChild(criarBotoesAdicionarReduzir("Sananga", "Kg"));
subsecaoProdutos.appendChild(subsecaoSananga);

// Artesanatos
const subsecaoArtesanatos = document.createElement("div");
subsecaoArtesanatos.id = "subsecao-artesanatos";
subsecaoArtesanatos.innerHTML = "<h4>Artesanatos</h4>";
subsecaoArtesanatos.appendChild(criarInputQuantidade("Unidades"));
subsecaoArtesanatos.appendChild(criarBotoesAdicionarReduzir("Artesanatos", "Unidades"));
subsecaoProdutos.appendChild(subsecaoArtesanatos);

// Tabaco
const subsecaoTabaco = document.createElement("div");
subsecaoTabaco.id = "subsecao-tabaco";
subsecaoTabaco.innerHTML = "<h4>Tabaco</h4>";
subsecaoTabaco.appendChild(criarInputQuantidade("Kg"));
subsecaoTabaco.appendChild(criarBotoesAdicionarReduzir("Tabaco", "MateriasPrimas"));
subsecaoInsumos.appendChild(subsecaoTabaco);

// Cinzas
const subsecaoCinzas = document.createElement("div");
subsecaoCinzas.id = "subsecao-cinzas";
subsecaoCinzas.innerHTML = "<h4>Cinzas</h4>";
subsecaoCinzas.appendChild(criarInputQuantidade("Kg"));
subsecaoCinzas.appendChild(criarSelectTipos("Cinzas"));
subsecaoCinzas.appendChild(criarBotoesAdicionarReduzir("Cinzas", "MateriasPrimas"));
subsecaoInsumos.appendChild(subsecaoCinzas);

// Pacotes
const subsecaoPacotes = document.createElement("div");
subsecaoPacotes.id = "subsecao-pacotes";
subsecaoPacotes.innerHTML = "<h4>Pacotes</h4>";
subsecaoPacotes.appendChild(criarInputQuantidade("Unidades"));
subsecaoPacotes.appendChild(criarBotoesAdicionarReduzir("Pacotes", "MateriasPrimas"));
subsecaoInsumos.appendChild(subsecaoPacotes);

// Adesivos Grandes
const subsecaoAdesivosGrandes = document.createElement("div");
subsecaoAdesivosGrandes.id = "subsecao-adesivos-grandes";
subsecaoAdesivosGrandes.innerHTML = "<h4>Adesivos Grandes</h4>";
subsecaoAdesivosGrandes.appendChild(criarInputQuantidade("Unidades"));
subsecaoAdesivosGrandes.appendChild(criarBotoesAdicionarReduzir("AdesivosGrandes", "MateriasPrimas"));
subsecaoInsumos.appendChild(subsecaoAdesivosGrandes);

// ... (Continuação do código js/scriptEstoque.js)

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
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
    carregarEstoqueDoLocalStorage();
    atualizarInformacoesEstoque();
    exibirModal();
    carregarVariedadesRape();
    carregarVariedadesCinzas();
    adicionarEventosManipulacao();
});



function carregarVariedadesRape() {
    const listaVariedades = document
        .getElementById('lista-variedades-rape');
    listaVariedades.innerHTML = ''; // Limpa a lista antes de adicionar itens

    for (const tipoRape of tiposDeRape) {
        const quantidade = estoque.rape.variedades[tipoRape] || 0; // Obtém a quantidade ou 0 se não existir
        const listItem = document.createElement('li');
        listItem.textContent = `${tipoRape}: ${quantidade}Kg`;
        listaVariedades.appendChild(listItem);
    }
}

function carregarVariedadesCinzas() {
    const listaVariedades = document
        .getElementById('lista-variedades-cinzas');
    listaVariedades.innerHTML = ''; // Limpa a lista antes de adicionar itens

    for (const tipoCinza of tiposDeCinzas) {
        const quantidade = estoque.materiaisPrimas.cinzas.variedades[tipoCinza] || 0; // Obtém a quantidade ou 0 se não existir
        const listItem = document.createElement('li');
        listItem.textContent = `${tipoCinza}: ${quantidade}Kg`;
        listaVariedades.appendChild(listItem);
    }
}

function exibirModal() {
    document
        .getElementById('exibir-variedades-rape')
        .addEventListener('click', function() {
            document
                .getElementById('modal-variedades-rape')
                .style.display = 'block';
        });

    document
        .getElementById('exibir-variedades-cinzas')
        .addEventListener('click', function() {
            document
                .getElementById('modal-variedades-cinzas')
                .style.display = 'block';
        });
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function atualizarInformacoesEstoque() {
    let rapeQuantidade = 0;
    let couripeQuantidade = 0;
    let sanangaQuantidade = 0;
    let artesanatosQuantidade = 0;
    let cinzasQuantidade = 0;
    let tabacoQuantidade = 0;
    let pacotesQuantidade = 0;
    let adesivosGrandesQuantidade = 0;


    fetch('/api/estoque', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do estoque.');
        }
        return response.json();
    })
    .then(data => {

        // Atualiza a exibição dos produtos
        const produtos = data.produtos;
        produtos.forEach(produto => {
                if (produto.nome === 'Rapé') {
                    const quantidadeRape = document.getElementById('rape-disponivel');
                    rapeQuantidade = parseFloat(produto.quantidade);
                    quantidadeRape.textContent = `${rapeQuantidade.toFixed(1)}Kg (${(produto.quantidade * 2).toFixed(0)} Pacotes)`;
                }
                if (produto.nome === 'Couripes') {
                    const quantidadeCouripe = document.getElementById('couripes-disponiveis');
                    couripeQuantidade = parseFloat(produto.quantidade);
                    quantidadeCouripe.textContent = `${couripeQuantidade.toFixed(0)} Un.`;
                }
                if (produto.nome === 'Sananga') {
                    const quantidadeSananga = document.getElementById('sananga-disponivel');
                    sanangaQuantidade = parseFloat(produto.quantidade);
                    quantidadeSananga.textContent = `${sanangaQuantidade.toFixed(1)} Kg.`;
                }
                if (produto.nome === 'Artesanatos') {
                    const quantidadeArtesanatos = document.getElementById('artesanatos-disponiveis');
                    artesanatosQuantidade = parseFloat(produto.quantidade);
                    quantidadeArtesanatos.textContent = `${artesanatosQuantidade.toFixed(0)} Un.`;
                }
        });

        // Atualiza a exibição das matérias-primas
        const materiasPrimas = data.materiasPrimas;
        console.log(materiasPrimas)
        materiasPrimas.forEach(materiasPrima => {
            //
            if (materiasPrima.nome === 'Cinzas') {
                const quantidadeCinzas = document.getElementById('cinzas-disponivel');
                cinzasQuantidade = parseFloat(materiasPrima.quantidade);
                quantidadeCinzas.textContent = `${cinzasQuantidade.toFixed(1)} Kg`;
            }
            if (materiasPrima.nome === 'Tabaco') {
                const quantidadeTabaco = document.getElementById('tabaco-disponivel');
                tabacoQuantidade = parseFloat(materiasPrima.quantidade);
                quantidadeTabaco.textContent = `${tabacoQuantidade.toFixed(1)} Kg`;
            }
            if (materiasPrima.nome === 'Pacotes') {
                const quantidadePacotes = document.getElementById('pacotes-disponiveis');
                pacotesQuantidade = parseFloat(materiasPrima.quantidade);
                quantidadePacotes.textContent = `${pacotesQuantidade.toFixed(0)} Un.`;
            }
            if (materiasPrima.nome === 'Adesivos Grandes') {
                const quantidadeAdesivosGrandes = document.getElementById('adesivos-grandes-disponiveis');
                adesivosGrandesQuantidade = parseFloat(materiasPrima.quantidade);
                quantidadeAdesivosGrandes.textContent = `${adesivosGrandesQuantidade.toFixed(0)} Un.`;
            }
        });


        // Adiciona a lógica de cores para a quantidade de rapé
        const rapeDisponivelSpan = document.getElementById('rape-disponivel');
        if (rapeQuantidade < 30) {
            rapeDisponivelSpan.style.color = 'red';
        } else if (rapeQuantidade >= 30 && rapeQuantidade <= 60) {
            rapeDisponivelSpan.style.color = 'yellow';
        } else {
            rapeDisponivelSpan.style.color = 'green';
        }

        // Adiciona a lógica de cores para a quantidade de tabaco
        const tabacoDisponivelSpan = document.getElementById('tabaco-disponivel');
        if (tabacoQuantidade < 30) {
            tabacoDisponivelSpan.style.color = 'red';
        } else if (tabacoQuantidade >= 30 && tabacoQuantidade <= 60) {
            tabacoDisponivelSpan.style.color = 'yellow';
        } else {
            tabacoDisponivelSpan.style.color = 'green';
        }

        // Adiciona a lógica de cores para a quantidade de cinzas
        const cinzasDisponivelSpan = document.getElementById('cinzas-disponivel');
        if (cinzasQuantidade < 50) {
            cinzasDisponivelSpan.style.color = 'red';
        } else if (cinzasQuantidade >= 50 && cinzasQuantidade <= 100)
        {
            cinzasDisponivelSpan.style.color = 'yellow';
        } else {
            cinzasDisponivelSpan.style.color = 'green';
        }

        // Adiciona a lógica de cores para a quantidade de pacotes
        const pacotesDisponiveisSpan = document.getElementById('pacotes-disponiveis');
        if (pacotesQuantidade < 80) {
            pacotesDisponiveisSpan.style.color = 'red';
        } else if (pacotesQuantidade >= 80 && pacotesQuantidade <= 150)
        {
            pacotesDisponiveisSpan.style.color = 'yellow';
        } else {
            pacotesDisponiveisSpan.style.color = 'green';
        }

        // Adiciona a lógica de cores para a quantidade de adesivos grandes
        const adesivosGrandesDisponiveisSpan = document.getElementById('adesivos-grandes-disponiveis');
        if (adesivosGrandesQuantidade < 80) {
            adesivosGrandesDisponiveisSpan.style.color = 'red';
        } else if (adesivosGrandesQuantidade >= 80 && adesivosGrandesQuantidade <= 150)
        {
            adesivosGrandesDisponiveisSpan.style.color = 'yellow';
        } else {
            adesivosGrandesDisponiveisSpan.style.color = 'green';
        }



    })
    .catch(error => {
        console.error('Erro ao carregar dados do estoque:', error);
        alert('Erro ao carregar dados do estoque.');
    });
    salvarEstoqueNoLocalStorage();
}




function adicionarEventosManipulacao() {
    // Rapé
    document
        .getElementById('btn-adicionar-rape')
        .addEventListener('click', adicionarRape);
    document
        .getElementById('btn-reduzir-rape')
        .addEventListener('click', reduzirRape);

    // Couripes
    document
        .getElementById('btn-adicionar-couripes')
        .addEventListener('click', adicionarCouripes);
    document
        .getElementById('btn-reduzir-couripes')
        .addEventListener('click', reduzirCouripes);

    // Sananga
    document
        .getElementById('btn-adicionar-sananga')
        .addEventListener('click', adicionarSananga);
    document
        .getElementById('btn-reduzir-sananga')
        .addEventListener('click', reduzirSananga);

    // Artesanatos
    document
        .getElementById('btn-adicionar-artesanatos')
        .addEventListener('click', adicionarArtesanatos);
    document
        .getElementById('btn-reduzir-artesanatos')
        .addEventListener('click', reduzirArtesanatos);

    // Tabaco
    document
        .getElementById('btn-adicionar-tabaco')
        .addEventListener('click', adicionarTabaco);
    document
        .getElementById('btn-reduzir-tabaco')
        .addEventListener('click', reduzirTabaco);

    // Cinzas
    document
        .getElementById('btn-adicionar-cinzas')
        .addEventListener('click', adicionarCinzas);
    document
        .getElementById('btn-reduzir-cinzas')
        .addEventListener('click', reduzirCinzas);

    // Pacotes
    document
        .getElementById('btn-adicionar-pacotes')
        .addEventListener('click', adicionarPacotes);
    document
        .getElementById('btn-reduzir-pacotes')
        .addEventListener('click', reduzirPacotes);

    // Adesivos Grandes
    document
        .getElementById('btn-adicionar-adesivos-grandes')
        .addEventListener(
            'click',
            adicionarAdesivosGrandes
        );
    document
        .getElementById('btn-reduzir-adesivos-grandes')
        .addEventListener('click', reduzirAdesivosGrandes);
}

function obterQuantidadeInput(inputId) {
    return parseInt(document.getElementById(inputId).value) || 0;
}

function confirmarAlteracao(
    mensagem,
    funcaoConfirmar,
    funcaoCancelar
) {
    if (confirm(mensagem)) {
        funcaoConfirmar();
    } else {
        if (funcaoCancelar) {
            funcaoCancelar();
        }
    }
}

// Funções para manipular o estoque de Rapé
function adicionarRape() {
    const quantidadePacotes = obterQuantidadeInput(
        'input-quantidade-rape'
    );
    const tipoRape = document.getElementById(
        'select-tipo-rape'
    ).value;

    if (quantidadePacotes <= 0 || !tipoRape) {
        alert(
            'Por favor, insira uma quantidade válida e selecione um tipo de rapé.'
        );
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidadePacotes} pacotes de rapé ${tipoRape} ao estoque?`,
        () => {
            estoque.rape.total += quantidadePacotes / 2;
            estoque.rape.variedades[tipoRape] =
                (estoque.rape.variedades[tipoRape] || 0) +
                quantidadePacotes / 2;
            atualizarInformacoesEstoque();
            carregarVariedadesRape();

            // Pergunta se deseja deduzir insumos (pacote e adesivo)
            confirmarAlteracao(
                'Deseja deduzir os insumos (pacote e adesivo) utilizados na produção?',
                () => {
                    estoque.materiaisPrimas.pacotes -=
                        quantidadePacotes;
                    estoque.materiaisPrimas.adesivosGrandes -=
                        quantidadePacotes;
                    atualizarInformacoesEstoque();
                }
            );
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirRape() {
    const quantidadePacotes = obterQuantidadeInput(
        'input-quantidade-rape'
    );
    const tipoRape = document.getElementById(
        'select-tipo-rape'
    ).value;

    if (
        quantidadePacotes <= 0 ||
        !tipoRape ||
        (estoque.rape.variedades[tipoRape] || 0) <
            quantidadePacotes / 2
    ) {
        alert(
            'Por favor, insira uma quantidade válida e/ou tipo de rapé.'
        );
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidadePacotes} pacotes de rapé ${tipoRape} do estoque?`,
        () => {
            estoque.rape.total -= quantidadePacotes / 2;
            estoque.rape.variedades[tipoRape] -=
                quantidadePacotes / 2;
            atualizarInformacoesEstoque();
            carregarVariedadesRape();
        }
    );
    atualizarInformacoesEstoque();
}

// Funções para manipular o estoque de Couripes
function adicionarCouripes() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-couripes'
    );
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidade} unidades de couripes ao estoque?`,
        () => {
            estoque.couripes += quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirCouripes() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-couripes'
    );
    if (quantidade <= 0 || estoque.couripes < quantidade) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidade} unidades de couripes do estoque?`,
        () => {
            estoque.couripes -= quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

// Funções para manipular o estoque de Sananga
function adicionarSananga() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-sananga'
    );
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidade} Kg de sananga ao estoque?`,
        () => {
            estoque.sananga += quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirSananga() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-sananga'
    );
    if (quantidade <= 0 || estoque.sananga < quantidade) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidade} Kg de sananga do estoque?`,
        () => {
            estoque.sananga -= quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

// Funções para manipular o estoque de Artesanatos
function adicionarArtesanatos() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-artesanatos'
    );
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidade} unidades de artesanatos ao estoque?`,
        () => {
            estoque.artesanatos += quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirArtesanatos() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-artesanatos'
    );
    if (quantidade <= 0 || estoque.artesanatos < quantidade) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidade} unidades de artesanatos do estoque?`,
        () => {
            estoque.artesanatos -= quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

// Funções para manipular o estoque de Tabaco
function adicionarTabaco() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-tabaco'
    );
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidade} Kg de tabaco ao estoque?`,
        () => {
            estoque.materiaisPrimas.tabaco += quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirTabaco() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-tabaco'
    );
    if (
        quantidade <= 0 ||
        estoque.materiaisPrimas.tabaco < quantidade
    ) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidade} Kg de tabaco do estoque?`,
        () => {
            estoque.materiaisPrimas.tabaco -= quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

// Funções para manipular o estoque de Cinzas
function adicionarCinzas() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-cinzas'
    );
    const tipoCinzas = document.getElementById(
        'select-tipo-cinzas'
    ).value;

    if (quantidade <= 0 || !tipoCinzas) {
        alert(
            'Por favor, insira uma quantidade válida e selecione um tipo de cinza.'
        );
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidade} Kg de cinza ${tipoCinzas} ao estoque?`,
        () => {
            estoque.materiaisPrimas.cinzas.total +=
                quantidade;
            estoque.materiaisPrimas.cinzas.variedades[
                tipoCinzas
            ] =
                (
                    estoque.materiaisPrimas.cinzas
                        .variedades[tipoCinzas] || 0
                ) + quantidade;
            atualizarInformacoesEstoque();
            carregarVariedadesCinzas();
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirCinzas() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-cinzas'
    );
    const tipoCinzas = document.getElementById(
        'select-tipo-cinzas'
    ).value;

    if (
        quantidade <= 0 ||
        !tipoCinzas ||
        (
            estoque.materiaisPrimas.cinzas.variedades[
                tipoCinzas
            ] || 0
        ) < quantidade
    ) {
        alert(
            'Por favor, insira uma quantidade válida e/ou tipo de cinza.'
        );
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidade} Kg de cinza ${tipoCinzas} do estoque?`,
        () => {
            estoque.materiaisPrimas.cinzas.total -=
                quantidade;
            estoque.materiaisPrimas.cinzas.variedades[
                tipoCinzas
            ] -= quantidade;
            atualizarInformacoesEstoque();
            carregarVariedadesCinzas();
        }
    );
    atualizarInformacoesEstoque();
}

// Funções para manipular o estoque de Pacotes
function adicionarPacotes() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-pacotes'
    );
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidade} unidades de pacotes ao estoque?`,
        () => {
            estoque.materiaisPrimas.pacotes += quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirPacotes() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-pacotes'
    );
    if (
        quantidade <= 0 ||
        estoque.materiaisPrimas.pacotes < quantidade
    ) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidade} unidades de pacotes do estoque?`,
        () => {
            estoque.materiaisPrimas.pacotes -= quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

// Funções para manipular o estoque de Adesivos Grandes
function adicionarAdesivosGrandes() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-adesivos-grandes'
    );
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja adicionar ${quantidade} unidades de adesivos grandes ao estoque?`,
        () => {
            estoque.materiaisPrimas.adesivosGrandes +=
                quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}

function reduzirAdesivosGrandes() {
    const quantidade = obterQuantidadeInput(
        'input-quantidade-adesivos-grandes'
    );
    if (
        quantidade <= 0 ||
        estoque.materiaisPrimas.adesivosGrandes < quantidade
    ) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(
        `Deseja remover ${quantidade} unidades de adesivos grandes do estoque?`,
        () => {
            estoque.materiaisPrimas.adesivosGrandes -=
                quantidade;
            atualizarInformacoesEstoque();
        }
    );
    atualizarInformacoesEstoque();
}


// função para popular os selects
function popularSelectTipos(selectId, tipos) {
    const select = document.getElementById(selectId);
    tipos.forEach((tipo) => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
}

// Chame a função para popular os selects de tipos de rapé e cinzas
popularSelectTipos('select-tipo-rape', tiposDeRape);
popularSelectTipos('select-tipo-cinzas', tiposDeCinzas);
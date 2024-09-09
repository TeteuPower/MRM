document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
    atualizarInformacoesEstoque();
    exibirModal();
    carregarVariedadesRape();
    carregarVariedadesCinzas();
    adicionarEventosManipulacao();
    // Chame a função para popular os selects de tipos de rapé e cinzas
    popularSelectTiposRape('select-tipo-cinzas');
    popularSelectTiposRape('select-tipo-rape');
});



function carregarVariedadesRape() {
    const listaVariedades = document.getElementById('lista-variedades-rape');
    listaVariedades.innerHTML = ''; // Limpa a lista

    // Faz uma requisição à API para obter as variedades de rapé
    fetch('/api/estoque', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar variedades de rapé.1');
        }
        return response.json();
    })
    .then(data => {
        const variedades = data.variedadesRape;
        //console.log(variedades)
        // Itera sobre as variedades e adiciona cada uma à lista
        variedades.forEach(variedade => {
            const listItem = document.createElement('li');
            let variedadeQuantidade = parseFloat(variedade.quantidade);
            listItem.textContent = `${variedade.nome}: ${variedadeQuantidade.toFixed(1)} Kg`; // Formata a quantidade com duas casas decimais
            listaVariedades.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar variedades de rapé.2');
        console.error(error);
    });
}

function carregarVariedadesCinzas() {
    const listaVariedades = document.getElementById('lista-variedades-cinzas');
    listaVariedades.innerHTML = ''; // Limpa a lista antes de adicionar itens

    // Faz uma requisição à API para obter as variedades de cinzas
    fetch('/api/estoque', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar variedades de cinzas.1');
        }
        return response.json();
    })
    .then(data => {
        const variedades = data.variedadesCinzas;
        console.log(variedades)
        // Ordena as variedades com quantidade maior que 0 em ordem decrescente
        const variedadesComQuantidade = variedades.filter(variedade => variedade.quantidade > 0);
        variedadesComQuantidade.sort((a, b) => b.quantidade - a.quantidade);

        // Ordena as variedades com quantidade 0 em ordem alfabética
        const variedadesSemQuantidade = variedades.filter(variedade => variedade.quantidade == 0);
        variedadesSemQuantidade.sort((a, b) => a.nome.localeCompare(b.nome));

        // Concatena as duas listas e adiciona à página
        const variedadesOrdenadas = [...variedadesComQuantidade, ...variedadesSemQuantidade];
        variedadesOrdenadas.forEach(variedade => {
            const listItem = document.createElement('li');
            let variedadeQuantidade = parseFloat(variedade.quantidade);
            listItem.textContent = `${variedade.nome}: ${variedadeQuantidade.toFixed(1)} Kg`; // Formata a quantidade com duas casas decimais
            listaVariedades.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar variedades de cinzas.2');
        console.error(error);
    });
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
        .addEventListener('click', adicionarAdesivosGrandes);
    document
        .getElementById('btn-reduzir-adesivos-grandes')
        .addEventListener('click', reduzirAdesivosGrandes);
}

function obterQuantidadeInput(inputId) {
    return parseInt(document.getElementById(inputId).value) || 0;
}

function confirmarAlteracao(mensagem,funcaoConfirmar,funcaoCancelar) {
    if (confirm(mensagem))
    {
        funcaoConfirmar();
    } else
    {
        if (funcaoCancelar)
        {
            funcaoCancelar();
        }
    }
}

function adicionarRape()
{
    const quantidadePacotes = obterQuantidadeInput('input-quantidade-rape');
    const tipoRape = document.getElementById('select-tipo-rape').value;

    if (quantidadePacotes <= 0 || !tipoRape)
    {
        alert('Por favor, insira uma quantidade válida e selecione um tipo de rapé.');
        return;
    }

    confirmarAlteracao(`Deseja adicionar ${quantidadePacotes} pacotes de rapé ${tipoRape} ao estoque?`,() => 
        {
            // Faz uma requisição para a API para adicionar o rapé
            fetch('/api/estoque',
            {
                method: 'PUT',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify
                ({
                    nome: tipoRape,
                    quantidade: quantidadePacotes / 2 // Converte pacotes para Kg
                })
            })
            .then(response =>
            {
                if (!response.ok) {
                  throw new Error('Erro ao adicionar rapé.1');
                }
                return response.json();
            })
            .then(data =>
                { // Aqui você recebe a resposta da API
                    // Se a API responder com sucesso, você pode deduzir os insumos
                    confirmarAlteracao('Deseja deduzir os insumos (pacote e adesivo) utilizados na produção?', () =>
                    {
                    // Lógica para deduzir insumos
                
                    alert('Os Rapés foram adicionados e os respectivos insumos deduzidos')
                    window.location.reload();
                    }, () =>
                        {
                        alert('Os Rapés foram adicionados sem alterar os insumos!')
                        window.location.reload();
                        });
                }
            )

            .catch(error =>
            {
                alert('Erro ao adicionar rapé.2');
                console.error(error);
            });
        });

}

function reduzirRape() {
    const quantidadePacotes = obterQuantidadeInput('input-quantidade-rape');
    const tipoRape = document.getElementById('select-tipo-rape').value;

    if (quantidadePacotes <= 0 || !tipoRape)
    {
        alert('Por favor, insira uma quantidade válida e/ou tipo de rapé.');
        return;
    }

    confirmarAlteracao(`Deseja remover ${quantidadePacotes} pacotes de rapé ${tipoRape} do estoque?`,() => 
        {
            // Faz uma requisição para a API
            fetch('/api/estoque',
            {
                method: 'PUT',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify
                ({
                    nome: tipoRape,
                    quantidade: - (quantidadePacotes / 2) // Converte pacotes para Kg
                })
            })
            .then(response =>
            {
                if (!response.ok)
                {
                    throw new Error('Erro ao remover rapé.1');
                }
                return response.json();
            })
            .catch(error => {
                alert('Erro ao remover rapé.2');
                console.error(error);
            });
            alert('Rapés removidos com sucesso!')
            window.location.reload();
        }
    );
}

// Funções para manipular o estoque de Couripes
function adicionarCouripes() {
    const quantidade = obterQuantidadeInput('input-quantidade-couripes');
    if (quantidade <= 0)
    {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    confirmarAlteracao(`Deseja adicionar ${quantidade} unidades de couripes ao estoque?`,() =>
        {
            // Faz uma requisição para a API
            fetch('/api/estoque/couripes',
                {
                    method: 'PUT',
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify
                    ({
                        quantidade: quantidade 
                    })
                })
                .then(response =>
                {
                    if (!response.ok)
                    {
                        throw new Error('Erro ao adicionar Couripe.1');
                    }
                    return response.json();
                })
                .catch(error => {
                    alert('Erro ao adicionar Couripe.2');
                    console.error(error);
                });
            alert('Couripes adicionados com sucesso!')
            window.location.reload();
        }
    );
}

function reduzirCouripes() {
    const quantidade = obterQuantidadeInput('input-quantidade-couripes');
    if (quantidade <= 0)
    {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    confirmarAlteracao(`Deseja remover ${quantidade} unidades de couripes do estoque?`,() =>
        {
            // Faz uma requisição para a API
            fetch('/api/estoque/couripes',
                {
                    method: 'PUT',
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify
                    ({
                        quantidade: - quantidade 
                    })
                })
                .then(response =>
                {
                    if (!response.ok)
                    {
                        throw new Error('Erro ao remover Couripe.1');
                    }
                    return response.json();
                })
                .catch(error => {
                    alert('Erro ao remover Couripe.2');
                    console.error(error);
                });
            alert('Couripes removido com sucesso!') 
            window.location.reload();
        }
    );

}

// Funções para manipular o estoque de Sananga
function adicionarSananga() {
    const quantidade = obterQuantidadeInput('input-quantidade-sananga');
    if (quantidade <= 0)
    {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja adicionar ${quantidade} pacotes de sananga ao estoque?`,() =>
    {
        // Faz uma requisição para a API
        fetch('/api/estoque/sananga',
        {
            method: 'PUT',
            headers:
            {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify
            ({
                quantidade: quantidade / 2 // Converte pacotes para Kg
            })
        })
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Erro ao adicionar Sananga.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao adicionar Sananga.2');
            console.error(error);
        });
        alert('Sananga adicionada com sucesso!')
        window.location.reload();

    });
}

function reduzirSananga() {
    const quantidade = obterQuantidadeInput('input-quantidade-sananga');
    if (quantidade <= 0)
    {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja remover ${quantidade} pacotes de sananga do estoque?`,() =>
    {
        // Faz uma requisição para a API
        fetch('/api/estoque/sananga',
        {
            method: 'PUT',
            headers:
            {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify
            ({
                quantidade: - quantidade / 2 // Converte pacotes para Kg
            })
        })
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Erro ao remover Sananga.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao remover Sananga.2');
            console.error(error);
        });
        alert('Sananga removida com sucesso!')
        window.location.reload();
    });
}

// Funções para manipular o estoque de Artesanatos
function adicionarArtesanatos() {
    const quantidade = obterQuantidadeInput('input-quantidade-artesanatos');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja adicionar ${quantidade} unidades de artesanatos ao estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/artesanatos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar Artesanatos.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao adicionar Artesanatos.2');
            console.error(error);
        });
        alert('Artesanatos adicionados com sucesso!');
        window.location.reload();
    });
}

function reduzirArtesanatos() {
    const quantidade = obterQuantidadeInput('input-quantidade-artesanatos');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja remover ${quantidade} unidades de artesanatos do estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/artesanatos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: -quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao remover Artesanatos.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao remover Artesanatos.2');
            console.error(error);
        });
        alert('Artesanatos removidos com sucesso!');
        window.location.reload();
    });
}

// Funções para manipular o estoque de Tabaco
function adicionarTabaco() {
    const quantidade = obterQuantidadeInput('input-quantidade-tabaco');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja adicionar ${quantidade} Kg de tabaco ao estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/tabaco', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar Tabaco.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao adicionar Tabaco.2');
            console.error(error);
        });
        alert('Tabaco adicionado com sucesso!');
        window.location.reload();
    });
}

function reduzirTabaco() {
    const quantidade = obterQuantidadeInput('input-quantidade-tabaco');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja remover ${quantidade} Kg de tabaco do estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/tabaco', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: -quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao remover Tabaco.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao remover Tabaco.2');
            console.error(error);
        });
        alert('Tabaco removido com sucesso!');
        window.location.reload();
    });
}

// Funções para manipular o estoque de Cinzas
function adicionarCinzas() {
    const quantidade = obterQuantidadeInput('input-quantidade-cinzas');
    const tipoCinzas = document.getElementById('select-tipo-cinzas').value;

    if (quantidade <= 0 || !tipoCinzas) {
        alert('Por favor, insira uma quantidade válida e selecione um tipo de cinza.');
        return;
    }

    confirmarAlteracao(`Deseja adicionar ${quantidade} Kg de cinza ${tipoCinzas} ao estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/cinzas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                tipo: tipoCinzas,
                quantidade: quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar Cinzas.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao adicionar Cinzas.2');
            console.error(error);
        });
        alert('Cinzas adicionadas com sucesso!');
        window.location.reload();
    });
}

function reduzirCinzas() {
    const quantidade = obterQuantidadeInput('input-quantidade-cinzas');
    const tipoCinzas = document.getElementById('select-tipo-cinzas').value;

    if (quantidade <= 0 || !tipoCinzas) {
        alert('Por favor, insira uma quantidade válida e/ou tipo de cinza.');
        return;
    }

    confirmarAlteracao(`Deseja remover ${quantidade} Kg de cinza ${tipoCinzas} do estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/cinzas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                tipo: tipoCinzas,
                quantidade: -quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao remover Cinzas.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao remover Cinzas.2');
            console.error(error);
        });
        alert('Cinzas removidas com sucesso!');
        window.location.reload();
    });
}

// Funções para manipular o estoque de Pacotes
function adicionarPacotes() {
    const quantidade = obterQuantidadeInput('input-quantidade-pacotes');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja adicionar ${quantidade} unidades de pacotes ao estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/pacotes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar Pacotes.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao adicionar Pacotes.2');
            console.error(error);
        });
        alert('Pacotes adicionados com sucesso!');
        window.location.reload();
    });
}

function reduzirPacotes() {
    const quantidade = obterQuantidadeInput('input-quantidade-pacotes');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja remover ${quantidade} unidades de pacotes do estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/pacotes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: -quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao remover Pacotes.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao remover Pacotes.2');
            console.error(error);
        });
        alert('Pacotes removidos com sucesso!');
        window.location.reload();
    });
}

// Funções para manipular o estoque de Adesivos Grandes
function adicionarAdesivosGrandes() {
    const quantidade = obterQuantidadeInput('input-quantidade-adesivos-grandes');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja adicionar ${quantidade} unidades de adesivos grandes ao estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/adesivos-grandes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar Adesivos Grandes.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao adicionar Adesivos Grandes.2');
            console.error(error);
        });
        alert('Adesivos Grandes adicionados com sucesso!');
        window.location.reload();
    });
}

function reduzirAdesivosGrandes() {
    const quantidade = obterQuantidadeInput('input-quantidade-adesivos-grandes');
    if (quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    confirmarAlteracao(`Deseja remover ${quantidade} unidades de adesivos grandes do estoque?`, () => {
        // Faz uma requisição para a API
        fetch('/api/estoque/adesivos-grandes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                quantidade: -quantidade
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao remover Adesivos Grandes.1');
            }
            return response.json();
        })
        .catch(error => {
            alert('Erro ao remover Adesivos Grandes.2');
            console.error(error);
        });
        alert('Adesivos Grandes removidos com sucesso!');
        window.location.reload();
    });
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

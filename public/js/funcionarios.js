// funcionarios.js - lógica da página funcionarios.html

document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    carregarFuncionariosDoLocalStorage();
    exibirVendedores();
    exibirProdutores();
    exibirDesempenhoVendedores();
    exibirDesempenhoProdutores();
    carregarPedidosDoLocalStorage();

    document.getElementById('btn-adicionar-vendedor').addEventListener('click', adicionarVendedor);
    document.getElementById('btn-adicionar-produtor').addEventListener('click', adicionarProdutor);

    document.getElementById('lista-vendedores').addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const vendedorNome = event.target.textContent;
            exibirVendasVendedor(vendedorNome);
        }
    });

    document.getElementById('lista-produtores').addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const produtorNome = event.target.textContent;
            exibirProducoesProdutor(produtorNome);
        }
    });

    document.getElementById('btn-proxima-pagina-vendedor').addEventListener('click', () => {
        paginaAtualVendasVendedor++;
        exibirVendasVendedor(document.getElementById('modal-nome-vendedor').textContent);
    });
});

let paginaAtualVendasVendedor = 1;
const vendasPorPagina = 10; // Número de vendas por página


function exibirVendedores() {
    const listaVendedores = document.getElementById('lista-vendedores');
    listaVendedores.innerHTML = ''; // Limpa a lista

    // Faz uma requisição GET para a API para obter os funcionários
    fetch('/api/funcionarios', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar funcionários.');
        }
        return response.json();
    })
    .then(funcionarios => {
        // Itera sobre os funcionários e adiciona cada um à lista
        funcionarios.forEach(funcionario => {
            const listItem = document.createElement('li');
            listItem.textContent = funcionario.nome;
            listaVendedores.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar funcionários.');
        console.error(error);
    });
}

function exibirProdutores() {
    const listaProdutores = document.getElementById('lista-produtores');
    listaProdutores.innerHTML = ''; // Limpa a lista

    // Faz uma requisição GET para a API para obter os funcionários
    fetch('/api/funcionarios/produtores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar produtores.');
        }
        return response.json();
    })
    .then(funcionarios => {
        // Itera sobre os funcionários e adiciona cada um à lista
        funcionarios.forEach(funcionario => {
            const listItem = document.createElement('li');
            listItem.textContent = funcionario.nome;
            listaProdutores.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar funcionários.');
        console.error(error);
    });
}

function adicionarVendedor() {
    const novoVendedor = document.getElementById('novo-vendedor').value.trim();

    if (novoVendedor === '') {
        alert('Por favor, insira o nome do vendedor!');
        return;
    }

    // Verifica se o administrador logado é "Matheus"
    if (localStorage.getItem('administrador') !== 'Matheus')
    {
        alert('Apenas o administrador Matheus pode adicionar novos produtores.');
        return;
    }

    // Faz uma requisição POST para a API para adicionar o vendedor
    fetch('/api/funcionarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ nome: novoVendedor })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar vendedor.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        exibirVendedores();
        document.getElementById('novo-vendedor').value = ''; // Limpa o campo de input
    })
    .catch(error => {
        alert('Erro ao adicionar vendedor.');
        console.error(error);
    });
}

function adicionarProdutor() {
    const novoProdutor = document.getElementById('novo-produtor').value.trim();

    if (novoProdutor === '') {
        alert('Por favor, insira o nome do produtor!');
        return;
    }

    // Verifica se o administrador logado é "Matheus"
    if (localStorage.getItem('administrador') !== 'Matheus')
    {
        alert('Apenas o administrador Matheus pode adicionar novos produtores.');
        return;
    }

    // Faz uma requisição POST para a API para adicionar o vendedor
    fetch('/api/funcionarios/produtores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ nome: novoProdutor })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar produtor.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        exibirVendedores();
        document.getElementById('novo-produtor').value = ''; // Limpa o campo de input
    })
    .catch(error => {
        alert('Erro ao adicionar vendedor.');
        console.error(error);
    });
}

function exibirDesempenhoVendedores() {
    const listaVendedores = document.getElementById('lista-vendedores-desempenho');
    listaVendedores.innerHTML = ''; // Limpa a lista

    vendedores.forEach(vendedor => {
        const listItem = document.createElement('li');
        listItem.textContent = vendedor;
        listItem.addEventListener('click', () => {
            exibirVendasVendedor(vendedor);
        });
        listaVendedores.appendChild(listItem);
    });
}

function exibirDesempenhoProdutores() {
    const listaProdutores = document.getElementById('lista-produtores-desempenho');
    listaProdutores.innerHTML = ''; // Limpa a lista

    produtores.forEach(produtor => {
        const listItem = document.createElement('li');
        listItem.textContent = produtor;
        listItem.addEventListener('click', () => {
            exibirProducoesProdutor(produtor);
        });
        listaProdutores.appendChild(listItem);
    });
}

function exibirVendasVendedor(vendedor) {
    const tabelaVendas = document.getElementById('tabela-vendas-vendedor').getElementsByTagName('tbody')[0];
    tabelaVendas.innerHTML = ''; // Limpa a tabela

    const vendasDoVendedor = vendas.filter(venda => venda.vendedor === vendedor);

    const inicio = (paginaAtualVendasVendedor - 1) * vendasPorPagina;
    const fim = inicio + vendasPorPagina;
    const vendasPaginaAtual = vendasDoVendedor.slice(inicio, fim);

    vendasPaginaAtual.forEach(venda => {
        const row = tabelaVendas.insertRow();
        const cellPedido = row.insertCell();
        const cellCliente = row.insertCell();
        const cellData = row.insertCell();
        const cellValor = row.insertCell();
        const cellFrete = row.insertCell();
        const cellInsumos = row.insertCell();
        const cellProducao = row.insertCell();
        const cellLucro = row.insertCell();
        const cellStatus = row.insertCell();

        cellPedido.textContent = `Pedido nº ${venda.id}`;
        cellCliente.textContent = venda.cliente;
        cellData.textContent = formatarData(venda.dataCriacao);
        cellValor.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${venda.valorVenda.toFixed(2)}`;
        cellFrete.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${(venda.valorFrete ?? "Aguardando...")}`;
        cellInsumos.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${(calcularValorInsumos(venda) ?? 0).toFixed(2)}`;
        cellProducao.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${(calcularComissaoProdutor(venda) ?? 0).toFixed(2)}`;
        cellLucro.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${(calcularLucroVenda(venda) ?? 0).toFixed(2)}`;
        cellStatus.textContent = venda.status;
    });

    // Controle de exibição do botão "Próxima Página"
    const btnProximaPagina = document.getElementById('btn-proxima-pagina-vendedor');
    if (fim < vendasDoVendedor.length) {
        btnProximaPagina.style.display = 'block';
    } else {
        btnProximaPagina.style.display = 'none';
    }

    document.getElementById('modal-nome-vendedor').textContent = `Desempenho do Vendedor: ${vendedor}`;
    document.getElementById('modal-desempenho-vendedor').style.display = 'block';
}

function exibirProducoesProdutor(produtor) {
    const tabelaProducoes = document.getElementById('tabela-producoes-produtor').getElementsByTagName('tbody')[0];
    tabelaProducoes.innerHTML = ''; // Limpa a tabela

    const producoesDoProdutor = vendas.filter(venda => venda.produtor === produtor);

    producoesDoProdutor.forEach(venda => {
        const row = tabelaProducoes.insertRow();
        const cellPedido = row.insertCell();
        const cellVendedor = row.insertCell();
        const cellDataSolicitada = row.insertCell();
        const cellFinalizado = row.insertCell();
        const cellComissao = row.insertCell();
        const cellStatusRepasse = row.insertCell();

        cellPedido.textContent = `Pedido nº ${venda.id}`;
        cellVendedor.textContent = venda.vendedor;
        cellDataSolicitada.textContent = formatarData(venda.dataCriacao);
        cellFinalizado.textContent = venda.status === 'Finalizado' ? formatarData(venda.dataFinalizacao) : 'Aguardando Envio!';
        cellComissao.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${(calcularComissaoProdutor(venda) ?? 0).toFixed(2)}`;
        cellStatusRepasse.textContent = venda.repasseComissao ? 'Feito!' : 'Não feito';
    });

    document.getElementById('modal-nome-produtor').textContent = `Desempenho do Produtor: ${produtor}`;
    document.getElementById('modal-desempenho-produtor').style.display = 'block';
}

function fecharModalDesempenhoVendedor() {
    document.getElementById('modal-desempenho-vendedor').style.display = 'none';
}

function fecharModalDesempenhoProdutor() {
    document.getElementById('modal-desempenho-produtor').style.display = 'none';
}
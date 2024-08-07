// financas.js - lógica da página financas.html

document.addEventListener('DOMContentLoaded', function () {
    carregarFuncionariosDoLocalStorage();
    carregarClientesDoLocalStorage();
    carregarPedidosDoLocalStorage();
    exibirRepassesComissao();
    exibirPagamentosClientes();
    exibirClientesNegativos();
    exibirResumoMensal();
    popularSelectClientesPagamento();
    popularSelectVendedoresPagamento(); // Popula o select de vendedores na seção de pagamentos
    exibirRepassesPendentes(); // Exibe os repasses pendentes

    document.getElementById('btn-adicionar-pagamento').addEventListener('click', adicionarPagamento);
});

let paginaAtualRepasses = 1;
const repassesPorPagina = 5; // Número de repasses por página

function exibirRepassesComissao() {
    const listaRepasses = document.getElementById('lista-repasses-comissao');
    listaRepasses.innerHTML = ''; // Limpa a lista

    const repasses = vendas.filter(venda => venda.repasseComissao);
    // Ordena os repasses por data de criação (mais recentes primeiro)
    repasses.sort((a, b) => b.dataCriacao - a.dataCriacao);

    const inicio = (paginaAtualRepasses - 1) * repassesPorPagina;
    const fim = inicio + repassesPorPagina;
    const repassesPaginaAtual = repasses.slice(inicio, fim);

    repassesPaginaAtual.forEach(venda => {
        const listItem = document.createElement('li');
        listItem.textContent = `Pedido nº ${venda.id} - ${venda.produtor} - ${venda.moeda === 'real' ? 'R$' : 'US$'} ${calcularComissaoProdutor(venda).toFixed(2)} - Repassado por: ${venda.vendedorRepasse || '-'}`;
        listaRepasses.appendChild(listItem);
    });

    // Controle de exibição dos botões de paginação
    const btnProximaPagina = document.getElementById('btn-proxima-pagina-repasses');
    const btnPaginaAnterior = document.getElementById('btn-pagina-anterior-repasses');
    if (fim < repasses.length) {
        btnProximaPagina.style.display = 'block';
    } else {
        btnProximaPagina.style.display = 'none';
    }
    if (paginaAtualRepasses > 1) {
        btnPaginaAnterior.style.display = 'block';
    } else {
        btnPaginaAnterior.style.display = 'none';
    }

    // Criação do menu de paginação
    criarMenuPaginacaoRepasses(repasses.length);
}

function criarMenuPaginacaoRepasses(totalRepasses) {
    const menuPaginacao = document.getElementById('menu-paginacao-repasses');
    menuPaginacao.innerHTML = ''; // Limpa o menu

    const totalPaginas = Math.ceil(totalRepasses / repassesPorPagina);
    const paginaInicial = Math.max(1, paginaAtualRepasses - 3);
    const paginaFinal = Math.min(totalPaginas, paginaInicial + 7);

    for (let i = paginaInicial; i <= paginaFinal; i++) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        link.onclick = () => {
            paginaAtualRepasses = i;
            exibirRepassesComissao();
        };
        listItem.appendChild(link);
        menuPaginacao.appendChild(listItem);

        if (i === paginaAtualRepasses) {
            listItem.classList.add('ativo');
        }
    }
}

// Adicione event listeners aos botões de paginação
document.getElementById('btn-proxima-pagina-repasses').addEventListener('click', () => {
    paginaAtualRepasses++;
    exibirRepassesComissao();
});

document.getElementById('btn-pagina-anterior-repasses').addEventListener('click', () => {
    paginaAtualRepasses--;
    exibirRepassesComissao();
});

let paginaAtualPagamentos = 1;
const pagamentosPorPagina = 5; // Número de pagamentos por página

function exibirPagamentosClientes() {
    const listaPagamentos = document.getElementById('lista-pagamentos-clientes');
    listaPagamentos.innerHTML = ''; // Limpa a lista

    let todosPagamentos = [];
    clientes.forEach(cliente => {
    todosPagamentos = todosPagamentos.concat(cliente.pagamentos);
    // Ordena os pagamentos por data em ordem decrescente (mais recentes primeiro)
    todosPagamentos.sort((a, b) => b.data - a.data);
    });

    const inicio = (paginaAtualPagamentos - 1) * pagamentosPorPagina;
    const fim = inicio + pagamentosPorPagina;
    const pagamentosPaginaAtual = todosPagamentos.slice(inicio, fim);

    pagamentosPaginaAtual.forEach(pagamento => {
        const cliente = clientes.find(c => c.pagamentos.includes(pagamento));
        const listItem = document.createElement('li');
        listItem.textContent = `${cliente.nome} - ${formatarData(pagamento.data)} - ${pagamento.moeda === 'real' ? 'R$' : 'US$'} ${pagamento.valor.toFixed(2)} Recebido por: ${pagamento.vendedor}`;
        listaPagamentos.appendChild(listItem);
    });

    // Controle de exibição dos botões de paginação
    const btnProximaPagina = document.getElementById('btn-proxima-pagina-pagamentos');
    const btnPaginaAnterior = document.getElementById('btn-pagina-anterior-pagamentos');
    if (fim < todosPagamentos.length) {
        btnProximaPagina.style.display = 'block';
    } else {
        btnProximaPagina.style.display = 'none';
    }
    if (paginaAtualPagamentos > 1) {
        btnPaginaAnterior.style.display = 'block';
    } else {
        btnPaginaAnterior.style.display = 'none';
    }

    // Criação do menu de paginação
    criarMenuPaginacaoPagamentos(todosPagamentos.length);
}

function criarMenuPaginacaoPagamentos(totalPagamentos) {
    const menuPaginacao = document.getElementById('menu-paginacao-pagamentos');
    menuPaginacao.innerHTML = ''; // Limpa o menu

    const totalPaginas = Math.ceil(totalPagamentos / pagamentosPorPagina);
    const paginaInicial = Math.max(1, paginaAtualPagamentos - 3);
    const paginaFinal = Math.min(totalPaginas, paginaInicial + 7);

    for (let i = paginaInicial; i <= paginaFinal; i++) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        link.onclick = () => {
            paginaAtualPagamentos = i;
            exibirPagamentosClientes();
        };
        listItem.appendChild(link);
        menuPaginacao.appendChild(listItem);

        if (i === paginaAtualPagamentos) {
            listItem.classList.add('ativo');
        }
    }
}

// Adicione event listeners aos botões de paginação
document.getElementById('btn-proxima-pagina-pagamentos').addEventListener('click', () => {
    paginaAtualPagamentos++;
    exibirPagamentosClientes();
});

document.getElementById('btn-pagina-anterior-pagamentos').addEventListener('click', () => {
    paginaAtualPagamentos--;
    exibirPagamentosClientes();
});


let paginaAtualClientesNegativos = 1;
const clientesPorPagina = 5; // Número de clientes por página

function exibirClientesNegativos() {
    const listaClientesNegativos = document.getElementById('lista-clientes-negativos');
    listaClientesNegativos.innerHTML = ''; // Limpa a lista

    const clientesNegativos = clientes.filter(cliente => cliente.saldoReais < 0 || cliente.saldoDolares < 0);

    const inicio = (paginaAtualClientesNegativos - 1) * clientesPorPagina;
    const fim = inicio + clientesPorPagina;
    const clientesPaginaAtual = clientesNegativos.slice(inicio, fim);

    clientesPaginaAtual.forEach(cliente => {
        const listItem = document.createElement('li');
        listItem.textContent = `${cliente.nome} - Saldo: ${cliente.saldoReais < 0 ? `R$ ${cliente.saldoReais.toFixed(2)}` : `US$ ${cliente.saldoDolares.toFixed(2)}`}`;
        listaClientesNegativos.appendChild(listItem);
    });

    // Controle de exibição dos botões de paginação
    const btnProximaPagina = document.getElementById('btn-proxima-pagina-clientes');
    const btnPaginaAnterior = document.getElementById('btn-pagina-anterior-clientes');
    if (fim < clientesNegativos.length) {
        btnProximaPagina.style.display = 'block';
    } else {
        btnProximaPagina.style.display = 'none';
    }
    if (paginaAtualClientesNegativos > 1) {
        btnPaginaAnterior.style.display = 'block';
    } else {
        btnPaginaAnterior.style.display = 'none';
    }

    // Criação do menu de paginação
    criarMenuPaginacaoClientes(clientesNegativos.length);
}

function criarMenuPaginacaoClientes(totalClientes) {
    const menuPaginacao = document.getElementById('menu-paginacao-clientes');
    menuPaginacao.innerHTML = ''; // Limpa o menu

    const totalPaginas = Math.ceil(totalClientes / clientesPorPagina);
    const paginaInicial = Math.max(1, paginaAtualClientesNegativos - 3);
    const paginaFinal = Math.min(totalPaginas, paginaInicial + 7);

    for (let i = paginaInicial; i <= paginaFinal; i++) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        link.onclick = () => {
            paginaAtualClientesNegativos = i;
            exibirClientesNegativos();
        };
        listItem.appendChild(link);
        menuPaginacao.appendChild(listItem);

        if (i === paginaAtualClientesNegativos) {
            listItem.classList.add('ativo');
        }
    }
}

// Adicione event listeners aos botões de paginação
document.getElementById('btn-proxima-pagina-clientes').addEventListener('click', () => {
    paginaAtualClientesNegativos++;
    exibirClientesNegativos();
});

document.getElementById('btn-pagina-anterior-clientes').addEventListener('click', () => {
    paginaAtualClientesNegativos--;
    exibirClientesNegativos();
});

function exibirResumoMensal() {
    const listaResumoVendedores = document.getElementById('lista-resumo-vendedores');
    listaResumoVendedores.innerHTML = ''; // Limpa a lista

    const listaResumoProdutores = document.getElementById('lista-resumo-produtores');
    listaResumoProdutores.innerHTML = ''; // Limpa a lista

    const lucroTotal = calcularLucroTotal();
    document.getElementById('lucro-total').textContent = `R$ ${lucroTotal.toFixed(2)}`;

    const resumoVendedores = calcularResumoVendedores();
    resumoVendedores.forEach(vendedor => {
        const listItem = document.createElement('li');
        listItem.textContent = `${vendedor.nome}: R$ ${vendedor.ganhos.toFixed(2)}`;
        listaResumoVendedores.appendChild(listItem);
    });

    const resumoProdutores = calcularResumoProdutores();
    resumoProdutores.forEach(produtor => {
        const listItem = document.createElement('li');
        listItem.textContent = `${produtor.nome}: R$ ${produtor.ganhos.toFixed(2)}`;
        listaResumoProdutores.appendChild(listItem);
    });
}

function popularSelectClientesPagamento() {
    const selectClientePagamento = document.getElementById('cliente-pagamento');
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        selectClientePagamento.appendChild(option);
    });
}

function adicionarPagamento() {
    const cliente = document.getElementById('cliente-pagamento').value;
    const valor = parseFloat(document.getElementById('valor-pagamento').value);
    const moeda = document.getElementById('moeda-pagamento').value;
    const vendedor = document.getElementById('recebeu-pagamento').value; // Obtém o vendedor selecionado

    if (cliente === '' || isNaN(valor) || valor <= 0 || vendedor === '') { // Verifica se o vendedor foi selecionado
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    const clienteObj = clientes.find(c => c.nome === cliente);

    if (clienteObj) {
        clienteObj.pagamentos.push({
            data: new Date(),
            valor: valor,
            moeda: moeda,
            vendedor: document.getElementById('recebeu-pagamento').value // Adiciona o vendedor ao pagamento
        });

        if (moeda === 'real') {
            clienteObj.saldoReais += valor;
        } else {
            clienteObj.saldoDolares += valor;
        }

        salvarClientesNoLocalStorage();
        exibirPagamentosClientes();
        exibirClientesNegativos();
        document.getElementById('valor-pagamento').value = ''; // Limpa o campo de input

        alert('Pagamento registrado com sucesso!');

    }
}

function calcularLucroTotal() {
    let lucroTotal = 0;
    vendas.forEach(venda => {
        lucroTotal += calcularLucroVenda(venda);
    });
    return lucroTotal;
}

function calcularResumoVendedores() {
    const resumoVendedores = {};
    vendedores.forEach(vendedor => {
        resumoVendedores[vendedor] = {
            nome: vendedor,
            ganhos: 0
        };
    });

    vendas.forEach(venda => {
        if (resumoVendedores[venda.vendedor]) {
            resumoVendedores[venda.vendedor].ganhos += venda.valorVenda;
        }
    });

    return Object.values(resumoVendedores);
}

function calcularResumoProdutores() {
    const resumoProdutores = {};
    produtores.forEach(produtor => {
        resumoProdutores[produtor] = {
            nome: produtor,
            ganhos: 0
        };
    });

    vendas.forEach(venda => {
        if (resumoProdutores[venda.produtor]) {
            resumoProdutores[venda.produtor].ganhos += calcularComissaoProdutor(venda);
        }
    });

    return Object.values(resumoProdutores);
}


function popularSelectVendedoresPagamento() {
    const selectVendedor = document.getElementById('recebeu-pagamento');
    selectVendedor.innerHTML = '<option value="">Selecione o vendedor</option>'; // Limpa as opções existentes

    if (typeof vendedores !== 'undefined' && vendedores.length > 0) {
        vendedores.forEach(vendedor => {
            const option = document.createElement('option');
            option.value = vendedor;
            option.textContent = vendedor;
            selectVendedor.appendChild(option);
        });
    } else {
        alert('Não existem vendedores cadastrados! Cadastre um vendedor para receber pagamentos.');
        window.location.href = 'funcionarios.html';
        return; // Encerra a função se não houver vendedores
    }
}

function exibirRepassesPendentes() {
    const listaRepassesPendentes = document.getElementById('lista-repasses-pendentes-comissao');
    listaRepassesPendentes.innerHTML = ''; // Limpa a lista

    const repassesPendentes = vendas.filter(venda => venda.status === 'Finalizado' && !venda.repasseComissao);

    if (repassesPendentes.length > 0) {
        repassesPendentes.forEach(venda => {
            const listItem = document.createElement('li');
            listItem.textContent = `Pedido nº ${venda.id} - Produtor: ${venda.produtor} - Valor: ${venda.moeda === 'real' ? 'R$' : 'US$'} ${calcularComissaoProdutor(venda).toFixed(2)}`;
            listaRepassesPendentes.appendChild(listItem);
        });
    } else {
        // Exibe a mensagem "Em dia com a produção" se não houver repasses pendentes
        const listItem = document.createElement('li');
        listItem.textContent = 'Em dia com a produção!';
        listaRepassesPendentes.appendChild(listItem);
    }
}

// Adicione um event listener ao botão "Adicionar repasse para Produtor"
document.getElementById('btn-adicionar-pagamento-produtor').addEventListener('click', abrirModalRepassesProdutores);

function abrirModalRepassesProdutores() {
    popularListaRepassesModal();
    popularSelectVendedoresRepasse();
    atualizarResumoRepasses(); // Inicializa o resumo com valor zero

    document.getElementById('modal-repasses-produtores').style.display = 'block';
}

function fecharModalRepassesProdutores() {
    document.getElementById('modal-repasses-produtores').style.display = 'none';
}

function popularListaRepassesModal() {
    const listaRepassesModal = document.getElementById('lista-repasses-modal');
    listaRepassesModal.innerHTML = ''; // Limpa a lista

    vendas.forEach(venda => {
        if (venda.status === 'Finalizado' && !venda.repasseComissao) {
            const listItem = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = venda.id;
            checkbox.addEventListener('change', atualizarResumoRepasses); // Atualiza o resumo ao selecionar/deselecionar
            listItem.appendChild(checkbox);

            const label = document.createElement('label');
            label.textContent = `Pedido nº ${venda.id} - Produtor: ${venda.produtor} - Valor: ${venda.moeda === 'real' ? 'R$' : 'US$'} ${(calcularComissaoProdutor(venda).toFixed(2))}`;
            listItem.appendChild(label);

            listaRepassesModal.appendChild(listItem);
        }
    });
}

function popularSelectVendedoresRepasse() {
    const selectVendedor = document.getElementById('vendedor-repasse');
    selectVendedor.innerHTML = '<option value="">Selecione o Vendedor</option>';

    if (typeof vendedores !== 'undefined' && vendedores.length > 0) {
        vendedores.forEach(vendedor => {
            const option = document.createElement('option');
            option.value = vendedor;
            option.textContent = vendedor;
            selectVendedor.appendChild(option);
        });
    } else {
        alert('Não existem vendedores cadastrados! Cadastre um vendedor para receber pagamentos.');
        window.location.href = 'funcionarios.html';
        return; // Encerra a função se não houver vendedores
    }
}

function atualizarResumoRepasses() {
    const checkboxes = document.querySelectorAll('#lista-repasses-modal input[type="checkbox"]:checked');
    let totalRepasses = 0;

    checkboxes.forEach(checkbox => {
        const vendaId = parseInt(checkbox.value);
        const venda = vendas.find(v => v.id === vendaId);
        if (venda) {
            totalRepasses += calcularComissaoProdutor(venda);
        }
    });

    document.getElementById('total-repasses').textContent = `R$ ${totalRepasses.toFixed(2)}`;
}

// Adicione um event listener ao botão "Confirmar Repasses"
document.getElementById('btn-confirmar-repasses').addEventListener('click', confirmarRepasses);

function confirmarRepasses() {
    const checkboxes = document.querySelectorAll('#lista-repasses-modal input[type="checkbox"]:checked');
    const vendedorResponsavel = document.getElementById('vendedor-repasse').value;

    if (checkboxes.length === 0) {
        alert('Selecione pelo menos um repasse para confirmar.');
        return;
    }

    if (vendedorResponsavel === '') {
        alert('Selecione o vendedor responsável pelos repasses.');
        return;
    }

    if (confirm(`Confirma os repasses selecionados para os produtores?`)) {
        checkboxes.forEach(checkbox => {
            const vendaId = parseInt(checkbox.value);
            const venda = vendas.find(v => v.id === vendaId);
            if (venda) {
                venda.repasseComissao = true;
                venda.vendedorRepasse = vendedorResponsavel; // Adiciona o vendedor responsável ao repasse
            }
        });

        salvarPedidosNoLocalStorage();
        fecharModalRepassesProdutores();
        exibirRepassesComissao();
        exibirRepassesPendentes();
    }
}
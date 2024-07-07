// financas.js - lógica da página financas.html

document.addEventListener('DOMContentLoaded', function () {
    carregarClientesDoLocalStorage();
    carregarPedidosDoLocalStorage();
    exibirRepassesComissao();
    exibirPagamentosClientes();
    exibirClientesNegativos();
    exibirResumoMensal();
    popularSelectClientesPagamento();

    document.getElementById('btn-adicionar-pagamento').addEventListener('click', adicionarPagamento);
});

function exibirRepassesComissao() {
    const listaRepasses = document.getElementById('lista-repasses-comissao');
    listaRepasses.innerHTML = ''; // Limpa a lista

    vendas.forEach(venda => {
        if (venda.repasseComissao) {
            const listItem = document.createElement('li');
            listItem.textContent = `Pedido nº ${venda.id} - Produtor: ${venda.produtor} - Valor: ${venda.moeda === 'real' ? 'R$' : 'US$' } ${calcularComissaoProdutor(venda).toFixed(2)}`;
            listaRepasses.appendChild(listItem);
        }
    });
}

function exibirPagamentosClientes() {
    const listaPagamentos = document.getElementById('lista-pagamentos-clientes');
    listaPagamentos.innerHTML = ''; // Limpa a lista

    clientes.forEach(cliente => {
        cliente.pagamentos.forEach(pagamento => {
            const listItem = document.createElement('li');
            listItem.textContent = `Cliente: ${cliente.nome} - Data: ${formatarData(pagamento.data)} - Valor: ${pagamento.moeda === 'real' ? 'R$' : 'US$' } ${pagamento.valor.toFixed(2)}`;
            listaPagamentos.appendChild(listItem);
        });
    });
}

function exibirClientesNegativos() {
    const listaClientesNegativos = document.getElementById('lista-clientes-negativos');
    listaClientesNegativos.innerHTML = ''; // Limpa a lista

    clientes.filter(cliente => cliente.saldoReais < 0 || cliente.saldoDolares < 0).forEach(cliente => {
        const listItem = document.createElement('li');
        listItem.textContent = `${cliente.nome} - Saldo: ${cliente.saldoReais < 0 ? `R$ ${cliente.saldoReais.toFixed(2)}` : `US$ ${cliente.saldoDolares.toFixed(2)}`}`;
        listaClientesNegativos.appendChild(listItem);
    });
}

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

    if (cliente === '' || isNaN(valor) || valor <= 0) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    const clienteObj = clientes.find(c => c.nome === cliente);

    if (clienteObj) {
        clienteObj.pagamentos.push({
            data: new Date(),
            valor: valor,
            moeda: moeda
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

function formatarData(data) {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

function calcularValorInsumos(venda) {
    const valorVenda = venda.valorVenda;
    const valorFrete = venda.valorFrete;
    return (valorVenda - valorFrete) * (4 / 25);
}

function calcularComissaoProdutor(venda) {
    const valorVenda = venda.valorVenda;
    const valorFrete = venda.valorFrete;
    return (valorVenda - valorFrete) * (1 / 25);
}

function calcularLucroVenda(venda) {
    const valorVenda = venda.valorVenda;
    const valorFrete = venda.valorFrete;
    const valorInsumos = calcularValorInsumos(venda);
    const comissaoProdutor = calcularComissaoProdutor(venda);
    return valorVenda - valorFrete - valorInsumos - comissaoProdutor;
}
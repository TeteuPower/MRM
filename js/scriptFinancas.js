// Seleciona os elementos do DOM
const listaRepasses = document.getElementById("lista-repasses");
const selectClientePagamento = document.getElementById("cliente-pagamento");
const inputValorPagamento = document.getElementById("valor-pagamento");
const selectMoedaPagamento = document.getElementById("moeda-pagamento");
const btnAdicionarPagamento = document.getElementById("btn-adicionar-pagamento");
const listaClientesNegativos = document.getElementById("lista-clientes-negativos");
const lucroTotalReal = document.getElementById("lucro-total-real");
const lucroTotalDolar = document.getElementById("lucro-total-dolar");
const listaLucroVendedorReal = document.getElementById("lista-lucro-vendedor-real");
const listaLucroVendedorDolar = document.getElementById("lista-lucro-vendedor-dolar");
const listaLucroProdutorReal = document.getElementById("lista-lucro-produtor-real");
const listaLucroProdutorDolar = document.getElementById("lista-lucro-produtor-dolar");

// Função para atualizar o select de clientes
function atualizarSelectCliente() {
    selectClientePagamento.innerHTML = "";
    clientes.forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente.id;
        option.textContent = cliente.nome;
        selectClientePagamento.appendChild(option);
    });
}

// Função para atualizar a lista de repasses para produtores
function atualizarListaRepasses() {
    listaRepasses.innerHTML = "";
    // Lógica para verificar os repasses e atualizar a lista (a ser implementada)
}

// Função para adicionar um pagamento de cliente
function adicionarPagamentoCliente() {
    const clienteId = parseInt(selectClientePagamento.value);
    const valor = parseFloat(inputValorPagamento.value);
    const moeda = selectMoedaPagamento.value;

    const cliente = clientes.find(cliente => cliente.id === clienteId);
    if (cliente) {
        if (moeda === "real") {
            cliente.saldoReal += valor;
        } else if (moeda === "dolar") {
            cliente.saldoDolar += valor;
        }
        salvarDados();
        atualizarListaClientesNegativos();
        atualizarSelectCliente();
        inputValorPagamento.value = "";
        exibirMensagem("Pagamento adicionado com sucesso!");
    } else {
        exibirMensagem("Cliente não encontrado!");
    }
}

// Função para atualizar a lista de clientes com saldo negativo
function atualizarListaClientesNegativos() {
    listaClientesNegativos.innerHTML = "";
    clientes.forEach(cliente => {
        if (cliente.saldoReal < 0 || cliente.saldoDolar < 0) {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${cliente.nome}</strong><br>
                Saldo (Real): R$ ${cliente.saldoReal.toFixed(2)}<br>
                Saldo (Dólar): US$ ${cliente.saldoDolar.toFixed(2)}
            `;
            listaClientesNegativos.appendChild(li);
        }
    });
}

// Função para atualizar o resumo geral
function atualizarResumoGeral() {
    let lucroTotalRealValue = 0;
    let lucroTotalDolarValue = 0;
    const lucroVendedorReal = {};
    const lucroVendedorDolar = {};
    const lucroProdutorReal = {};
    const lucroProdutorDolar = {};

    pedidos.forEach(pedido => {
        const lucroBruto = pedido.valor - pedido.valorPago;
        const custoProducao = lucroBruto * 0.2;
        const lucroLiquido = lucroBruto - custoProducao;
        const repasseProdutor = lucroLiquido * 0.05;

        if (pedido.status === "Finalizado") {
            if (pedido.moeda === "real") {
                lucroTotalRealValue += lucroLiquido;
                lucroVendedorReal[pedido.vendedor] = (lucroVendedorReal[pedido.vendedor] || 0) + lucroLiquido - repasseProdutor;
                produtores.forEach(produtor => {
                    lucroProdutorReal[produtor] = (lucroProdutorReal[produtor] || 0) + repasseProdutor / produtores.length;
                });
            } else if (pedido.moeda === "dolar") {
                lucroTotalDolarValue += lucroLiquido;
                lucroVendedorDolar[pedido.vendedor] = (lucroVendedorDolar[pedido.vendedor] || 0) + lucroLiquido - repasseProdutor;
                produtores.forEach(produtor => {
                    lucroProdutorDolar[produtor] = (lucroProdutorDolar[produtor] || 0) + repasseProdutor / produtores.length;
                });
            }
        }
    });

    lucroTotalReal.textContent = lucroTotalRealValue.toFixed(2);
    lucroTotalDolar.textContent = lucroTotalDolarValue.toFixed(2);

    listaLucroVendedorReal.innerHTML = "";
    for (const vendedor in lucroVendedorReal) {
        const li = document.createElement("li");
        li.textContent = `${vendedor}: R$ ${lucroVendedorReal[vendedor].toFixed(2)}`;
        listaLucroVendedorReal.appendChild(li);
    }

    listaLucroVendedorDolar.innerHTML = "";
    for (const vendedor in lucroVendedorDolar) {
        const li = document.createElement("li");
        li.textContent = `${vendedor}: US$ ${lucroVendedorDolar[vendedor].toFixed(2)}`;
        listaLucroVendedorDolar.appendChild(li);
    }

    listaLucroProdutorReal.innerHTML = "";
    for (const produtor in lucroProdutorReal) {
        const li = document.createElement("li");
        li.textContent = `${produtor}: R$ ${lucroProdutorReal[produtor].toFixed(2)}`;
        listaLucroProdutorReal.appendChild(li);
    }

    listaLucroProdutorDolar.innerHTML = "";
    for (const produtor in lucroProdutorDolar) {
        const li = document.createElement("li");
        li.textContent = `${produtor}: US$ ${lucroProdutorDolar[produtor].toFixed(2)}`;
        listaLucroProdutorDolar.appendChild(li);
    }
}

// Adiciona evento de clique ao botão "Adicionar Pagamento"
btnAdicionarPagamento.addEventListener("click", adicionarPagamentoCliente);

// Atualiza os dados ao carregar a página
atualizarSelectCliente();
atualizarListaRepasses();
atualizarListaClientesNegativos();
atualizarResumoGeral();

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
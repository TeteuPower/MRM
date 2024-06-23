// funcoes.js

// Função para salvar a lista de clientes no Local Storage
function salvarClientesNoLocalStorage() {
    localStorage.setItem('clientes', JSON.stringify(window.clientes));
}

// Função para carregar a lista de clientes do Local Storage
function carregarClientesDoLocalStorage() {
    const clientesStorage = localStorage.getItem('clientes');
    if (clientesStorage) {
        window.clientes = JSON.parse(clientesStorage);
    } else {
        window.clientes = [];
    }
}


function gerarIdVenda() {
    const novoId = proximaIdVenda;
    proximaIdVenda++;
    return novoId;
}

function salvarVendasNoLocalStorage() {
    localStorage.setItem('vendas', JSON.stringify(vendas));
    localStorage.setItem('proximaIdVenda', proximaIdVenda);
}

function carregarVendasDoLocalStorage() {
    const vendasStorage = localStorage.getItem('vendas');
    if (vendasStorage) {
        vendas = JSON.parse(vendasStorage);
    } else {
        vendas = [];
    }

    const proximaIdVendaStorage = localStorage.getItem('proximaIdVenda');
    if (proximaIdVendaStorage) {
        proximaIdVenda = parseInt(proximaIdVendaStorage);
    } else {
        proximaIdVenda = 1;
    }
}
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
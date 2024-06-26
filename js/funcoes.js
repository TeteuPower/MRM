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

// Função para salvar o estoque no Local Storage (crie esta função em funcoes.js)

function salvarEstoqueNoLocalStorage() {
    localStorage.setItem('estoque', JSON.stringify(window.estoque));
}

function carregarEstoqueDoLocalStorage() {
    const estoqueStorage = localStorage.getItem('estoque');
    if (estoqueStorage) {
        window.estoque = JSON.parse(estoqueStorage);
    } else {
        // Define o estoque inicial se não houver dados no Local Storage
        window.estoque = {
            rape: {
                total: 100, 
                variedades: {
                    CHACRONA: 20,
                    "JUREMA BRANCA": 15,
                    SAMSARA: 5,
                    ANGICO: 10,
                    JATOBA: 8,
                    CINNAMON: 6,
                    NUTMEG: 12,
                    "NUKINI JAGUAR": 7,
                    "YAWANAWA FF": 9,
                    BOBINSANA: 4,
                    TSUNU: 11,
                    MURICI: 3,
                    CACAU: 2,
                    CUMARU: 1,
                    JUREMA: 18,
                    VASHAWÁ: 16,
                    "PAU PEREIRA(PARICÁ)": 14,
                    MULATEIRO: 13,
                    "RED TSUNU": 19,
                    "CANELA DE VELHO": 21,
                    "7 HIERBAS": 17,
                    "PAU BRASIL": 22 
                }
            },
            couripes: 25, 
            sananga: 50,  
            artesanatos: 15, 
            materiaisPrimas: {
                cinzas: {
                    total: 80, 
                    variedades: {
                        CHACRONA: 10,
                        "JUREMA BRANCA": 8,
                        SAMSARA: 5,
                        ANGICO: 12
                    }
                },
                tabaco: 40,
                pacotes: 120, 
                adesivosGrandes: 95
            }
        };
    }
}



function carregarPedidosDoLocalStorage() {
    const pedidosStorage = localStorage.getItem('vendas');
    if (pedidosStorage) {
        vendas = JSON.parse(pedidosStorage, (key, value) => {
            if (key === 'dataCriacao') {
                return new Date(value); // Converte a string de data para um objeto Date
            }
            return value;
        });
    } else {
        vendas = []; // Inicia um array vazio se não houver vendas
    }
}
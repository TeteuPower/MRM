// Define a senha administrativa
const SENHA_ADMIN = "admin123";

// Simulando o banco de dados com dados iniciais
let estoque = {
    produtos: {
        rape: {
            total: 0,
            tipos: {
                CHACRONA: 0,
                JUREMABRANCA: 0,
                SAMSARA: 0,
                ANGICO: 0,
                JATOBA: 0,
                CINNAMON: 0,
                NUTMEG: 0,
                NUKINIJAGUAR: 0,
                YAWANAWAFF: 0,
                BOBINSANA: 0,
                TSUNU: 0,
                MURICI: 0,
                CACAU: 0,
                CUMARU: 0,
                JUREMA: 0,
                VASHAWA: 0,
                PAUPEREIRA: 0,
                MULATEIRO: 0,
                REDTSUNU: 0,
                CANELADEVELHO: 0,
                HIERBAS: 0,
                PAUBRASIL: 0
            },
            reservado: 0
        },
        couripes: {
            total: 0,
            reservado: 0
        },
        sananga: {
            total: 0,
            reservado: 0
        },
        artesanatos: {
            total: 0,
            reservado: 0
        }
    },
    materiasPrimas: {
        tabaco: {
            total: 0
        },
        cinzas: {
            total: 0,
            tipos: {
                CHACRONA: 0,
                JUREMABRANCA: 0,
                SAMSARA: 0,
                ANGICO: 0,
                JATOBA: 0,
                CINNAMON: 0,
                NUTMEG: 0,
                NUKINIJAGUAR: 0,
                YAWANAWAFF: 0,
                BOBINSANA: 0,
                TSUNU: 0,
                MURICI: 0,
                CACAU: 0,
                CUMARU: 0,
                JUREMA: 0,
                VASHAWA: 0,
                PAUPEREIRA: 0,
                MULATEIRO: 0,
                REDTSUNU: 0,
                CANELADEVELHO: 0,
                HIERBAS: 0,
                PAUBRASIL: 0
            }
        },
        pacotes: {
            total: 0
        },
        adesivosGrandes: {
            total: 0
        }
    }
};

let clientes = [];

let pedidos = [];

let vendedores = ["Maithê", "Rafael"];

let produtores = ["Matheus"];

// Função para salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem("estoque", JSON.stringify(estoque));
    localStorage.setItem("clientes", JSON.stringify(clientes));
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.setItem("vendedores", JSON.stringify(vendedores));
    localStorage.setItem("produtores", JSON.stringify(produtores));
}

// Função para carregar os dados do localStorage
function carregarDados() {
    estoque = JSON.parse(localStorage.getItem("estoque")) || estoque;
    clientes = JSON.parse(localStorage.getItem("clientes")) || clientes;
    pedidos = JSON.parse(localStorage.getItem("pedidos")) || pedidos;
    vendedores = JSON.parse(localStorage.getItem("vendedores")) || vendedores;
    produtores = JSON.parse(localStorage.getItem("produtores")) || produtores;
}

// Carrega os dados ao iniciar a página
carregarDados();
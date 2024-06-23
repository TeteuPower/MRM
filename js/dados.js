const tiposDeRape = [
    "CHACRONA",
    "JUREMA BRANCA",
    "SAMSARA",
    "ANGICO",
    "JATOBA",
    "CINNAMON",
    "NUTMEG",
    "NUKINI JAGUAR",
    "YAWANAWA FF",
    "BOBINSANA",
    "TSUNU",
    "MURICI",
    "CACAU",
    "CUMARU",
    "JUREMA",
    "VASHAWÁ",
    "PAU PEREIRA(PARICÁ)",
    "MULATEIRO",
    "RED TSUNU",
    "CANELA DE VELHO",
    "7 HIERBAS",
    "PAU BRASIL"
];

const tiposDeCinzas = [
    "CHACRONA",
    "JUREMA BRANCA",
    "SAMSARA",
    "ANGICO",
    "JATOBA",
    "CINNAMON",
    "NUTMEG",
    "NUKINI JAGUAR",
    "YAWANAWA FF",
    "BOBINSANA",
    "TSUNU",
    "MURICI",
    "CACAU",
    "CUMARU",
    "JUREMA",
    "VASHAWÁ",
    "PAU PEREIRA(PARICÁ)",
    "MULATEIRO",
    "RED TSUNU",
    "CANELA DE VELHO",
    "7 HIERBAS",
    "PAU BRASIL"
];

let estoque = {
    rape: {
        total: 100, // em Kg
        variedades: {
            // Quantidade em Kg para cada tipo de rapé
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
    couripes: 25, // em unidades
    sananga: 50,  // em Kg
    artesanatos: 15, // em unidades
    // ... adicione os outros itens do estoque aqui

    // Materiais-Primas
    materiaisPrimas: {
        cinzas: {
            total: 80, // em Kg
            variedades: {
                // Quantidade em Kg para cada tipo de cinza
                CHACRONA: 10,
                "JUREMA BRANCA": 8,
                SAMSARA: 5,
                ANGICO: 12,
                // ... adicione as outras variedades aqui
            }
        },
        tabaco: 40, // em Kg
        pacotes: 120, // em unidades
        adesivosGrandes: 95 // em unidades
    }
};


let vendas = []; // Array para armazenar as vendas
let proximaIdVenda = 1; // Variável para controlar o próximo ID de venda
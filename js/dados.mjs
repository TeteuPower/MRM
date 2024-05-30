// Variáveis e Constantes Globais
const RAPES = [
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
  const CINZAS = [
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
  const PRODUTOS = ["Rapé", "Couripes", "Sananga", "Artesanatos"];
  const INSUMOS = ["Tabaco", "Cinzas", "Pacotes", "Adesivos Grandes"];
  let ESTOQUE = {
    Rapé: {
      total: 0,
      variedades: {},
      reservado: 0
    },
    Couripes: 0,
    Sananga: {
      total: 0,
      variedades: {},
      reservado: 0
    },
    Artesanatos: 0,
    Tabaco: {
      total: 0,
      variedades: {},
      reservado: 0
    },
    Cinzas: {
      total: 0,
      variedades: {},
      reservado: 0
    },
    Pacotes: 0,
    "Adesivos Grandes": 0
  };
  let CLIENTES = {};
  let VENDORES = ["Maithê", "Rafael"];
  let PRODUTORES = ["Matheus"];
  const SENHA_ADM = "adm123";
  let PEDIDOS = {};
  let PAGAMENTOS = {};
  
  // Função para carregar dados do localStorage
  function carregarDados() {
    ESTOQUE = JSON.parse(localStorage.getItem("ESTOQUE")) || ESTOQUE;
    CLIENTES = JSON.parse(localStorage.getItem("CLIENTES")) || CLIENTES;
    VENDORES = JSON.parse(localStorage.getItem("VENDORES")) || VENDORES;
    PRODUTORES = JSON.parse(localStorage.getItem("PRODUTORES")) || PRODUTORES;
    PEDIDOS = JSON.parse(localStorage.getItem("PEDIDOS")) || PEDIDOS;
    PAGAMENTOS = JSON.parse(localStorage.getItem("PAGAMENTOS")) || PAGAMENTOS;
  }
  
  // Função para salvar dados no localStorage
  function salvarDados() {
    localStorage.setItem("ESTOQUE", JSON.stringify(ESTOQUE));
    localStorage.setItem("CLIENTES", JSON.stringify(CLIENTES));
    localStorage.setItem("VENDORES", JSON.stringify(VENDORES));
    localStorage.setItem("PRODUTORES", JSON.stringify(PRODUTORES));
    localStorage.setItem("PEDIDOS", JSON.stringify(PEDIDOS));
    localStorage.setItem("PAGAMENTOS", JSON.stringify(PAGAMENTOS));
  }
  
  // Inicialização dos dados
  carregarDados();
  
  // Exporta as variáveis e funções globais
  export {
    RAPES,
    CINZAS,
    PRODUTOS,
    INSUMOS,
    ESTOQUE,
    CLIENTES,
    VENDORES,
    PRODUTORES,
    SENHA_ADM,
    PEDIDOS,
    PAGAMENTOS,
    carregarDados,
    salvarDados
  };
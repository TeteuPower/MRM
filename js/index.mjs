import {
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
    salvarDados,
    isAdministrador
  } from "../js/funcoes.mjs";
  
  // Inicialização
  carregarDados();
  
  // Função para verificar o login do usuário
  function verificarLogin() {
    let login = document.getElementById("login").value;
    let senha = document.getElementById("senha").value;
    if (CLIENTES[login] && CLIENTES[login].senha === senha) {
      localStorage.setItem("clienteLogado", login);
      window.location.href = "html/clientes/cliente.html";
    } else {
      alert("Login ou senha inválidos!");
    }
  }
  
  // Função para abrir o modal de login de administrador
  function abrirModalAdministracao() {
    let modal = document.createElement("div");
    modal.classList.add("modal", "administracao-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="fecharModalAdministracao()">×</span>
        <h2 class="modal-title">Administração</h2>
        <label for="senha-adm">Senha:</label>
        <input type="password" id="senha-adm" class="input">
        <button class="modal-button" onclick="verificarSenhaAdm()">Entrar</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para verificar a senha de administrador
  function verificarSenhaAdm() {
    let senha = document.getElementById("senha-adm").value;
    if (senha === SENHA_ADM) {
      localStorage.setItem("administrador", "true");
      window.location.href = "html/adm/estoque.html";
    } else {
      alert("Senha inválida!");
    }
    fecharModalAdministracao();
  }
  
  // Função para fechar o modal de login de administrador
  function fecharModalAdministracao() {
    let modal = document.querySelector(".administracao-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Carrega as informações na página
  window.onload = () => {
    // Verifica se o usuário já está logado como administrador
    if (isAdministrador()) {
      window.location.href = "html/adm/estoque.html";
    }
  };
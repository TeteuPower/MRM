import {
    RAPES,
    CINZAS,
    PRODUTOS,
    INSUMOS,
    ESTOQUE,
    CLIENTES,
    VENDORES,
    PRODUTOES,
    SENHA_ADM,
    PEDIDOS,
    PAGAMENTOS,
    carregarDados,
    salvarDados,
    adicionarNovoCliente
  } from "../../js/funcoes.js";
  
  // Inicialização
  carregarDados();
  
  // Função para registrar um novo cliente
  function registrarCliente() {
    let nome = document.getElementById("nome-cliente").value;
    let email = document.getElementById("email-cliente").value;
    let telefone = document.getElementById("telefone-cliente").value;
    let endereco = document.getElementById("endereco-cliente").value;
    let login = document.getElementById("login-cliente").value;
    let senha = document.getElementById("senha-cliente").value;
    // Modal de confirmação
    let modal = document.createElement("div");
    modal.classList.add("modal", "novo-cliente-modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">Confirmação</h2>
        <p class="modal-text">Você deseja adicionar o cliente ${nome}?</p>
        <button class="modal-button" onclick="confirmarNovoCliente('${nome}', '${email}', '${telefone}', '${endereco}', '${login}', '${senha}')">Sim</button>
        <button class="modal-button" onclick="fecharModalNovoCliente()">Não</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Função para confirmar a adição do novo cliente
  function confirmarNovoCliente(nome, email, telefone, endereco, login, senha) {
    adicionarNovoCliente(nome, email, telefone, endereco, login, senha);
    fecharModalNovoCliente();
    // Limpa o formulário
    document.getElementById("nome-cliente").value = "";
    document.getElementById("email-cliente").value = "";
    document.getElementById("telefone-cliente").value = "";
    document.getElementById("endereco-cliente").value = "";
    document.getElementById("login-cliente").value = "";
    document.getElementById("senha-cliente").value = "";
  }
  
  // Função para fechar o modal do novo cliente
  function fecharModalNovoCliente() {
    let modal = document.querySelector(".novo-cliente-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  // Limpa o formulário de novo cliente
  function limparFormularioNovoCliente() {
    document.getElementById("nome-cliente").value = "";
    document.getElementById("email-cliente").value = "";
    document.getElementById("telefone-cliente").value = "";
    document.getElementById("endereco-cliente").value = "";
    document.getElementById("login-cliente").value = "";
    document.getElementById("senha-cliente").value = "";
  }
  
  // Carrega as informações do estoque na página
  window.onload = () => {
    // Limpa o formulário
    limparFormularioNovoCliente();
  };
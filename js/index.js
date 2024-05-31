// Importa a função verificarAutenticacaoAdmin do arquivo funcoes.js
import { verificarAutenticacaoAdmin } from './funcoes.js';

// Importa o array de tipos de Rapé e Cinzas do arquivo dados.js
import dados from './dados.js';

// Função para abrir o modal de administrador
function abrirModalAdmin() {
  document.getElementById("modalAdmin").style.display = "block";
}

// Função para fechar o modal de administrador
function fecharModalAdmin() {
  document.getElementById("modalAdmin").style.display = "none";
}

// Função para verificar a senha de administrador
function verificarSenhaAdmin() {
  const senhaAdminInput = document.getElementById("senhaAdmin");
  const senhaAdmin = senhaAdminInput.value;

  // Acessando senhaAdministrativa dentro do objeto 'dados':
  if (senhaAdmin === dados.senhaAdministrativa) {
    // Define o status de autenticação como verdadeiro no localStorage
    localStorage.setItem('autenticadoAdmin', 'true');

    // Redireciona para a página de administração (estoque.html)
    window.location.href = "html/adm/estoque.html";
  } else {
    // Se a senha estiver incorreta, exibe um alerta
    alert("Senha incorreta!");
    senhaAdminInput.value = ""; // Limpa o campo de senha
  }
}

// Função para realizar o login do cliente (a ser implementada)
function fazerLogin() {
  // Lógica para verificar as credenciais do cliente (a ser implementada)

  // Redireciona para a área do cliente após o login (a ser implementada)
}

// Captura o botão "Administração" pelo ID e adiciona o evento de clique
const botaoAdmin = document.getElementById('botaoAdmin');
botaoAdmin.addEventListener('click', abrirModalAdmin);

// Captura o botão "Entrar" do modal pelo ID e adiciona o evento de clique
const botaoEntrarAdmin = document.getElementById('botaoEntrarAdmin');
botaoEntrarAdmin.addEventListener('click', verificarSenhaAdmin);

// Adiciona um evento para fechar o modal quando o usuário clicar fora dele
window.onclick = function (event) {
  const modal = document.getElementById("modalAdmin");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
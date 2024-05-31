// Função para verificar a autenticação de administrador
export function verificarAutenticacaoAdmin() {
    // Armazena o status de autenticação (inicialmente falso)
    let autenticado = false;
  
    // Tenta recuperar o status de autenticação do localStorage
    if (localStorage.getItem('autenticadoAdmin')) {
      autenticado = JSON.parse(localStorage.getItem('autenticadoAdmin'));
    }
  
    // Se não estiver autenticado, redireciona para a página de login
    if (!autenticado) {
      window.location.href = "../../index.html"; // Redireciona para o index.html
    }
  }
  
  // Chame esta função no início de cada página da área administrativa
  verificarAutenticacaoAdmin();
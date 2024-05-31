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

    if (senhaAdmin === senhaAdministrativa) {
        // Redireciona para a página de administração (por exemplo, estoque.html)
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

// Adiciona um evento para fechar o modal quando o usuário clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("modalAdmin");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ... (código anterior) ...

// Função para verificar a senha de administrador
function verificarSenhaAdmin() {
    const senhaAdminInput = document.getElementById("senhaAdmin");
    const senhaAdmin = senhaAdminInput.value;

    if (senhaAdmin === senhaAdministrativa) {
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

// ... (resto do código) ...
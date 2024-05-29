// Seleciona os elementos do DOM
const formLogin = document.getElementById("form-login");
const btnAdmin = document.getElementById("btn-admin");
const modalAdmin = document.getElementById("modal-admin");
const formSenhaAdmin = document.getElementById("form-senha-admin");
const spanClose = document.getElementsByClassName("close")[0];

// Adiciona evento de submit ao formulário de login
formLogin.addEventListener("submit", function(event) {
    event.preventDefault();
    const login = event.target.login.value;
    const senha = event.target.senha.value;
    // Redireciona para a área do cliente (a ser implementada)
    // Substitua "cliente.html" pela página correta
    window.location.href = "cliente.html";
});

// Adiciona evento de clique ao botão "Administração"
btnAdmin.addEventListener("click", function() {
    modalAdmin.style.display = "block";
});

// Adiciona evento de clique ao botão de fechar do modal
spanClose.addEventListener("click", function() {
    modalAdmin.style.display = "none";
});

// Adiciona evento de submit ao formulário de senha administrativa
formSenhaAdmin.addEventListener("submit", function(event) {
    event.preventDefault();
    const senhaAdmin = event.target.senhaAdmin.value;
    if (senhaAdmin === SENHA_ADMIN) {
        // Redireciona para a área de administração (estoque.html)
        window.location.href = "html/estoque.html";
    } else {
        exibirMensagem("Senha incorreta!");
    }
});
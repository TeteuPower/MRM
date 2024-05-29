// Seleciona os elementos do DOM
const formNovoCliente = document.getElementById("form-novo-cliente");

// Adiciona evento de submit ao formulário de novo cliente
formNovoCliente.addEventListener("submit", function(event) {
    event.preventDefault();
    const nome = event.target.nome.value;
    const email = event.target.email.value;
    const telefone = event.target.telefone.value;
    const endereco = event.target.endereco.value;
    const login = event.target.login.value;
    const senha = event.target.senha.value;

    if (validarEmail(email)) {
        adicionarCliente(nome, email, telefone, endereco, login, senha);
        formNovoCliente.reset();
    } else {
        exibirMensagem("Por favor, insira um endereço de e-mail válido.");
    }
});

// Navegação entre Páginas

// Seleciona os botões de navegação
const botoesPagina = document.querySelectorAll(".btn-pagina");

// Adiciona evento de clique aos botões de navegação
botoesPagina.forEach(botao => {
    botao.addEventListener("click", function() {
        const pagina = botao.dataset.pagina;
        window.location.href = `${pagina}.html`;
    });
});
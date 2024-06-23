// novo_cliente.js - lógica da página novo_cliente.html

carregarClientesDoLocalStorage();
document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('form-cadastro-cliente');

    formCadastro.addEventListener('submit', function(evento) {
        evento.preventDefault(); // Impede o envio padrão do formulário

        // Obtém os dados do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;
        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;

        // Cria um objeto cliente
        const novoCliente = {
            nome: nome,
            email: email,
            telefone: telefone,
            endereco: endereco,
            login: login,
            senha: senha,
            saldoReais: 0,
            saldoDolares: 0,
        };

        // Simula adição do cliente ao "banco de dados" (array clientes)
        clientes.push(novoCliente);
        salvarClientesNoLocalStorage();

        console.log('Cliente cadastrado com sucesso:', novoCliente); // Exibe o cliente no console (apenas para desenvolvimento)

        // Exibe o modal de confirmação
        if (confirm('Deseja realmente adicionar o cliente?')) {
            // Limpa o formulário
            formCadastro.reset();

            // Redireciona para a página de consulta de clientes (opcional)
            // window.location.href = 'consultar_cliente.html'; 
        }
    });
});
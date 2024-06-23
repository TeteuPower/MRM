// consultar_cliente.js - lógica da página consultar_cliente.html


carregarClientesDoLocalStorage();
document.addEventListener('DOMContentLoaded', function () {
    exibirClientes();
    carregarClientesDoLocalStorage(); // Carrega os clientes do Local Storage
    const pesquisaInput = document.getElementById('pesquisa-cliente');
    pesquisaInput.addEventListener('input', exibirClientes);
});

function exibirClientes() {
    const listaClientes = document.getElementById('lista-clientes');
    listaClientes.innerHTML = ''; // Limpa a lista antes de adicionar itens

    const termoPesquisa = document.getElementById('pesquisa-cliente').value.toLowerCase();

    // Filtra os clientes com base no termo de pesquisa
    const clientesFiltrados = clientes.filter(cliente => {
        return cliente.nome.toLowerCase().includes(termoPesquisa) ||
               cliente.email.toLowerCase().includes(termoPesquisa) || 
               cliente.telefone.includes(termoPesquisa); // Filtra por nome, email ou telefone
    });

    clientesFiltrados.forEach(cliente => {
        const listItem = document.createElement('li');
        listItem.textContent = cliente.nome;

        // Adiciona um event listener para exibir os detalhes do cliente no modal
        listItem.addEventListener('click', () => {
            exibirDetalhesCliente(cliente);
        });

        listaClientes.appendChild(listItem);
    });
}

function exibirDetalhesCliente(cliente) {
    // Preenche o modal com os detalhes do cliente
    document.getElementById('modal-nome-cliente').textContent = cliente.nome;
    document.getElementById('modal-email-cliente').textContent = cliente.email;
    document.getElementById('modal-telefone-cliente').textContent = cliente.telefone;
    document.getElementById('modal-endereco-cliente').textContent = cliente.endereco;
    // ... adicione outros detalhes do cliente aqui

    // Exibe o modal
    document.getElementById('modal-detalhes-cliente').style.display = 'block';
}

function fecharModalDetalhesCliente() {
    document.getElementById('modal-detalhes-cliente').style.display = 'none';
}
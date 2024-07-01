// consultar_cliente.js - lógica da página consultar_cliente.html


carregarClientesDoLocalStorage();
document.addEventListener('DOMContentLoaded', function () {
    exibirClientes();
    carregarClientesDoLocalStorage(); // Carrega os clientes do Local Storage
    const pesquisaInput = document.getElementById('pesquisa-cliente');
    pesquisaInput.addEventListener('input', exibirClientes);
});
document.getElementById('btn-extrato-cliente').addEventListener('click', exibirExtratoCliente);

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


// Adicione um event listener ao botão "Extrato do Cliente"
document.getElementById('btn-extrato-cliente').addEventListener('click', exibirExtratoCliente);

function exibirExtratoCliente() {
    const clienteNome = document.getElementById('modal-nome-cliente').textContent;
    const cliente = clientes.find(c => c.nome === clienteNome);

    if (cliente) {
        document.getElementById('extrato-nome-cliente').textContent = `Extrato do Cliente: ${cliente.nome}`;
        document.getElementById('saldo-reais').textContent = `R$ ${cliente.saldoReais.toFixed(2)}`;
        document.getElementById('saldo-dolares').textContent = `US$ ${cliente.saldoDolares.toFixed(2)}`;

        exibirTransacoes(cliente);
        document.getElementById('modal-extrato-cliente').style.display = 'block';
    }
}

function exibirTransacoes(cliente) {
    const tbodyExtrato = document.getElementById('tabela-extrato').getElementsByTagName('tbody')[0];
    tbodyExtrato.innerHTML = ''; // Limpa a tabela

    let saldoReais = 0;
    let saldoDolares = 0;

    // Ordena as vendas por data de criação (mais recentes primeiro)
    const vendasOrdenadas = vendas.slice().sort((a, b) => b.dataCriacao - a.dataCriacao);

    vendasOrdenadas.forEach(venda => {
        if (venda.cliente === cliente.nome) {
            const data = formatarData(venda.dataCriacao);
            const descricao = `Pedido nº ${venda.id}`;
            let valor = 0;
            let saldo = 0;

            if (venda.moeda === 'real') {
                valor = -venda.valorVenda; // Valor da venda é negativo no extrato
                saldoReais += valor;
                saldo = saldoReais;
            } else {
                valor = -venda.valorVenda;
                saldoDolares += valor;
                saldo = saldoDolares;
            }

            const row = tbodyExtrato.insertRow();
            const cellData = row.insertCell();
            const cellDescricao = row.insertCell();
            const cellValor = row.insertCell();
            const cellSaldo = row.insertCell();

            cellData.textContent = data;
            cellDescricao.textContent = descricao;
            cellValor.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${valor.toFixed(2)}`;
            cellSaldo.textContent = `${venda.moeda === 'real' ? 'R$' : 'US$' } ${saldo.toFixed(2)}`;
        }
    });
}

function fecharModalExtratoCliente() {
    document.getElementById('modal-extrato-cliente').style.display = 'none';
}


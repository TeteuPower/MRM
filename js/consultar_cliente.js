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

// Função que insere o extrato do cliente
function exibirTransacoes(cliente) {
    const tbodyExtrato = document.getElementById('tabela-extrato').getElementsByTagName('tbody')[0];
    tbodyExtrato.innerHTML = ''; // Limpa a tabela de pedidos
    const tbodyExtratoPagamentos = document.getElementById('tabela-pagamentos').getElementsByTagName('tbody')[0];
    tbodyExtratoPagamentos.innerHTML = ''; // Limpa a tabela de pagamentos

    let saldoReais = cliente.saldoReais; // Inicializa com o saldo do cliente
    let saldoDolares = cliente.saldoDolares; // Inicializa com o saldo do cliente

    // Ordena os pedidos do cliente por data de criação (mais recentes primeiro)
    const pedidosOrdenados = cliente.pedidos.slice().sort((a, b) => b.dataCriacao - a.dataCriacao);

    pedidosOrdenados.forEach(pedido => {
        //const data = formatarData(pedido.dataCriacao);
        const PedidoExtrato = `Pedido nº ${pedido.id}`;

        const row = tbodyExtrato.insertRow();
        const cellVendedor = row.insertCell(); //Coluna do nome do vendedor
        const cellPedidoExtrato = row.insertCell(); //Coluna do número do pedido
        const cellStatus = row.insertCell(); //Coluna de status do pedido
        const cellValorVenda = row.insertCell(); //Coluna de valor da venda
        const cellValorPago = row.insertCell(); //Coluna com o valor já pago
        const cellSaldoVenda = row.insertCell(); //Coluna do saldo atualizado da venda

        //Definindo o conteúdo das colunas
        cellVendedor.textContent = pedido.vendedor;
        cellPedidoExtrato.textContent = PedidoExtrato;
        cellStatus.textContent = pedido.status;
        cellValorVenda.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valorVenda}`;
        cellValorPago.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valorPago}`;
        cellSaldoVenda.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.saldoVenda}`;

        // Adiciona os itens do pedido como linhas separadas
        pedido.itens.forEach(item => {
            const itemRow = tbodyExtrato.insertRow();
            const itemCellData = itemRow.insertCell();
            const itemCellPedidoExtrato = itemRow.insertCell();
            const itemCellStatus = itemRow.insertCell();
            const itemCellSaldo = itemRow.insertCell();

            //itemCellData.textContent = ''; // Deixa a data em branco para os itens
            //itemCellPedidoExtrato.textContent = `- ${item.produto} ${item.tipoRape ? `(${item.tipoRape})` : ''} x${item.quantidade}`;
            //itemCellStatus.textContent = ''; // Deixa o valor em branco para os itens
            //itemCellSaldo.textContent = ''; // Deixa o saldo em branco para os itens
        });
    });
}

function fecharModalExtratoCliente() {
    document.getElementById('modal-extrato-cliente').style.display = 'none';
}


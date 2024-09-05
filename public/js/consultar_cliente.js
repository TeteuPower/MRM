// consultar_cliente.js - lógica da página consultar_cliente.html


carregarClientesDoLocalStorage();
document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    exibirClientes();
    carregarClientesDoLocalStorage(); // Carrega os clientes do Local Storage
    const pesquisaInput = document.getElementById('pesquisa-cliente');
    pesquisaInput.addEventListener('input', exibirClientes);
});
//document.getElementById('btn-extrato-cliente').addEventListener('click', exibirExtratoCliente);

function exibirClientes() {
    const listaClientes = document.getElementById('lista-clientes');
    listaClientes.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-cliente').value.toLowerCase();

    // Faz uma requisição GET para a API para obter os clientes
    fetch('/api/clientes', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar clientes.');
        }
        return response.json();
    })
    .then(clientes => {
        // Filtra os clientes com base no termo de pesquisa
        const clientesFiltrados = clientes.filter(cliente => {
            return cliente.nome.toLowerCase().includes(termoPesquisa) ||
                   cliente.email.toLowerCase().includes(termoPesquisa) ||
                   cliente.telefone.includes(termoPesquisa);
        });

        // Itera sobre os clientes filtrados e adiciona cada um à lista
        clientesFiltrados.forEach(cliente => {
            const listItem = document.createElement('li');
            listItem.textContent = cliente.nome;

            // Adiciona um event listener para exibir os detalhes do cliente no modal
            listItem.addEventListener('click', () => {
                exibirDetalhesCliente(cliente);
            });

            listaClientes.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar clientes.');
        console.error(error);
    });
}

function exibirDetalhesCliente(cliente) {
    // Faz uma requisição GET para a API para obter os detalhes do cliente
    fetch(`/api/clientes/${cliente.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar cliente.');
        }
        return response.json();
    })
    .then(cliente => {
        // Preenche o modal com os detalhes do cliente
        document.getElementById('modal-nome-cliente').textContent = cliente.nome;
        document.getElementById('modal-email-cliente').textContent = cliente.email;
        document.getElementById('modal-telefone-cliente').textContent = cliente.telefone;
        document.getElementById('modal-endereco-cliente').textContent = cliente.endereco;
        // ... adicione outros detalhes do cliente aqui

        // Exibe o modal
        document.getElementById('modal-detalhes-cliente').style.display = 'block';
        // Adicione o parâmetro cliente ao event listener do botão "Extrato do Cliente"
        document.getElementById('btn-extrato-cliente').addEventListener('click', () =>
        {
            exibirExtratoCliente(cliente); // Passa o objeto cliente para a função
        });
    })

    .catch(error => {
        alert('Erro ao buscar cliente.');
        console.error(error);
    });
}

function fecharModalDetalhesCliente() {
    document.getElementById('modal-detalhes-cliente').style.display = 'none';
}


function exibirExtratoCliente(cliente) {
    //console.log(cliente);

        document.getElementById('extrato-nome-cliente').textContent = `Extrato do Cliente: ${cliente.nome}`;
        document.getElementById('saldo-reais').textContent = `R$ ${parseFloat(cliente.saldoReais).toFixed(2)}`;
        document.getElementById('saldo-dolares').textContent = `US$ ${parseFloat(cliente.saldoDolares).toFixed(2)}`;

        exibirTransacoes(cliente.id); // Passa o ID do cliente para a função exibirTransacoes
        document.getElementById('modal-extrato-cliente').style.display = 'block';



}

// Função que insere o extrato do cliente
function exibirTransacoes(clienteId) {
    const tbodyExtrato = document.getElementById('tabela-extrato').getElementsByTagName('tbody')[0];
    tbodyExtrato.innerHTML = ''; // Limpa a tabela de pedidos
    const tbodyExtratoPagamentos = document.getElementById('tabela-pagamentos').getElementsByTagName('tbody')[0];
    tbodyExtratoPagamentos.innerHTML = ''; // Limpa a tabela de pagamentos


    // Faz uma requisição GET para a API para obter os pedidos do cliente
    fetch(`/api/pedidos/cliente/${clienteId}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos do cliente.');
        }
        return response.json();
    })
    .then(pedidos => {
        // Ordena os pedidos do cliente por ID (mais recentes primeiro)
        pedidos.sort((a, b) => b.id - a.id); // Ordena por ID em ordem decrescente

        pedidos.forEach(pedido => {
            const data = formatarData(pedido.dataCriacao);
            const PedidoExtrato = `Pedido nº ${pedido.id}`;
            //console.log(pedido);

            const row = tbodyExtrato.insertRow();
            const cellVendedor = row.insertCell(); //Coluna do nome do vendedor
            const cellPedidoExtrato = row.insertCell(); //Coluna do número do pedido
            const cellStatus = row.insertCell(); //Coluna de status do pedido
            const cellValorVenda = row.insertCell(); //Coluna de valor da venda
            const cellValorPago = row.insertCell(); //Coluna com o valor já pago
            const cellSaldoVenda = row.insertCell(); //Coluna do saldo atualizado da venda

            let vendedor = pedido.vendedor_id
            if (vendedor === 2) {
                vendedor = 'Maithê'
            };
            if (vendedor === 3) {
                vendedor = 'Rafael'
            }

            //Definindo o conteúdo das colunas
            cellVendedor.textContent = vendedor;
            cellPedidoExtrato.textContent = PedidoExtrato;
            cellStatus.textContent = pedido.status;
            cellValorVenda.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valor_venda}`;
            cellValorPago.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valor_pago}`;
            cellSaldoVenda.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.saldo_venda}`;

            // Adiciona os itens do pedido como linhas separadas
            /*pedido.itens.forEach(item => {
                const itemRow = tbodyExtrato.insertRow();
                const itemCellData = itemRow.insertCell();
                const itemCellPedidoExtrato = itemRow.insertCell();
                const itemCellStatus = itemRow.insertCell();
                const itemCellSaldo = itemRow.insertCell();

                //itemCellData.textContent = ''; // Deixa a data em branco para os itens
                //itemCellPedidoExtrato.textContent = `- ${item.produto} ${item.tipoRape ? `(${item.tipoRape})` : ''} x${item.quantidade}`;
                //itemCellStatus.textContent = ''; // Deixa o valor em branco para os itens
                //itemCellSaldo.textContent = ''; // Deixa o saldo em branco para os itens
            });*/
        });
    })
    .catch(error => {
        alert('Erro ao buscar pedidos do cliente.');
        console.error(error);
    });
}

function fecharModalExtratoCliente() {
    document.getElementById('modal-extrato-cliente').style.display = 'none';
}

// Adicione um event listener ao botão "Editar Cliente"
document.getElementById('btn-editar-cliente').addEventListener('click', abrirModalEditarCliente);

function abrirModalEditarCliente() {
    const clienteNome = document.getElementById('modal-nome-cliente').textContent;
    const cliente = clientes.find(c => c.nome === clienteNome);

    if (cliente) {
        document.getElementById('editar-nome').value = cliente.nome;
        document.getElementById('editar-email').value = cliente.email;
        document.getElementById('editar-telefone').value = cliente.telefone;
        document.getElementById('editar-endereco').value = cliente.endereco;
        document.getElementById('editar-login').value = cliente.login;
        document.getElementById('editar-senha').value = cliente.senha;

        document.getElementById('editar-nome-cliente').textContent = `Editar Cliente: ${cliente.nome}`;
        document.getElementById('modal-editar-cliente').style.display = 'block';
    }
}

function fecharModalEditarCliente() {
    document.getElementById('modal-editar-cliente').style.display = 'none';
}

// Adicione um event listener ao formulário de edição
document.getElementById('form-editar-cliente').addEventListener('submit', function(event) {
    event.preventDefault();

    const clienteNome = document.getElementById('modal-nome-cliente').textContent;
    const cliente = clientes.find(c => c.nome === clienteNome);

    if (cliente) {
        cliente.nome = document.getElementById('editar-nome').value;
        cliente.email = document.getElementById('editar-email').value;
        cliente.telefone = document.getElementById('editar-telefone').value;
        cliente.endereco = document.getElementById('editar-endereco').value;
        cliente.login = document.getElementById('editar-login').value;
        cliente.senha = document.getElementById('editar-senha').value;

        salvarClientesNoLocalStorage();
        fecharModalEditarCliente();
        fecharModalDetalhesCliente(); // Fecha o modal de detalhes do cliente
        exibirClientes(); // Atualiza a lista de clientes
    }
});
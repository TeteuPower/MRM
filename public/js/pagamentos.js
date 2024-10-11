// pagamentos.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                popularSelectClientes();
                popularSelectVendedores();

                document.getElementById('cliente-pagamento').addEventListener('change', exibirPedidosCliente);
                document.getElementById('form-pagamento-cliente').addEventListener('submit', registrarPagamento);
            }
        });
});


function popularSelectClientes() {
    const selectCliente = document.getElementById('cliente-pagamento');
    selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>';

    fetch('/api/pagamentos/clientes', {
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
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            selectCliente.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar clientes.');
        console.error(error);
    });
}

function popularSelectVendedores() {
    const selectVendedor = document.getElementById('recebeu-pagamento');
    selectVendedor.innerHTML = '<option value="">Selecione o vendedor</option>';

    fetch('/api/pagamentos/vendedores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar vendedores.');
        }
        return response.json();
    })
    .then(vendedores => {
        vendedores.forEach(vendedor => {
            const option = document.createElement('option');
            option.value = vendedor.id;
            option.textContent = vendedor.nome;
            selectVendedor.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar vendedores.');
        console.error(error);
    });
}

function exibirPedidosCliente() {
    const clienteId = document.getElementById('cliente-pagamento').value;
    const listaPedidos = document.getElementById('lista-pedidos-cliente');
    listaPedidos.innerHTML = '';

    if (clienteId === '') {
        return;
    }

    fetch(`/api/pagamentos/pedidos/${clienteId}`, {
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
        pedidos.forEach(pedido => {
            //console.log(pedido)
            const listItem = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = pedido.id;
            checkbox.moeda = pedido.moeda;
            checkbox.addEventListener('change', function() {
                const moedaSelect = document.getElementById('moeda-pagamento');
                moedaSelect.innerHTML = `<option value="${checkbox.moeda}">${checkbox.moeda === 'real' ? 'Real (R$)' : 'Dólar (US$)'}</option>`
            });
            listItem.appendChild(checkbox);

            const label = document.createElement('label');
            label.innerHTML = `Pedido nº ${pedido.id} - Saldo ${pedido.saldo_venda === '0.00' ? '<span class="span-verde">Pago</span>' : `<span class="span-vermelho">${pedido.moeda === 'real' ? 'R$' : 'US$'} ${pedido.saldo_venda}</span>`}`;
            listItem.appendChild(label);

            listaPedidos.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar pedidos do cliente.');
        console.error(error);
    });
}

function registrarPagamento(event) {
    event.preventDefault();

    const clienteId = document.getElementById('cliente-pagamento').value;
    const pedidoId = document.querySelector('#lista-pedidos-cliente input[type="checkbox"]:checked').value;
    const valor = parseFloat(document.getElementById('valor-pagamento').value);
    const moeda = document.getElementById('moeda-pagamento').value;
    const vendedorId = document.getElementById('recebeu-pagamento').value;

    if (clienteId === '' || isNaN(valor) || valor <= 0 || vendedorId === '') {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    fetch('/api/pagamentos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ clienteId, pedidoId, valor, moeda, vendedorId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao registrar pagamento.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        event.target.reset();
        exibirPedidosCliente();
    })
    .catch(error => {
        alert('Erro ao registrar pagamento.');
        console.error(error);
    });
}

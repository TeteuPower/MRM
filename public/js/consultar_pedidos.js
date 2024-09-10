// consultar_pedidos.js - lógica da página consultar_pedidos.html

document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    //carregarClientesDoLocalStorage();
    //carregarPedidosDoLocalStorage();
    exibirPedidos();
    //carregarFuncionariosDoLocalStorage();

    //document.getElementById('moeda').addEventListener('change', calcularSaldoVenda);
    document.getElementById('editar-valor-venda').addEventListener('input', calcularSaldoVenda);
    document.getElementById('editar-valor-pago').addEventListener('input', calcularSaldoVenda);

    const pesquisaInput = document.getElementById('pesquisa-pedido');
    pesquisaInput.addEventListener('input', exibirPedidos);

    document.getElementById('btn-proxima-pagina').addEventListener('click', () => {
        paginaAtualPedidosFinalizados++;
        exibirPedidosFinalizados();
        
    document.getElementById('btn-pagina-anterior').addEventListener('click', () => {
        if (paginaAtualPedidosFinalizados > 1) { // Verifica se não está na primeira página
            paginaAtualPedidosFinalizados--;
            exibirPedidosFinalizados();
        }
    });
    });
});

let paginaAtualPedidosFinalizados = 1;
const pedidosPorPagina = 5; // Número de pedidos finalizados por página

function exibirPedidos() {
    exibirPedidosAguardandoProducao();
    exibirPedidosFinalizadosAguardandoEnvio();
    exibirPedidosFinalizados();
}

function exibirPedidosNaoFinalizados() {
    const listaPedidos = document.getElementById('lista-pedidos-nao-finalizados');
    listaPedidos.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-pedido').value.toLowerCase();

    const pedidosNaoFinalizados = vendas.filter(pedido => {
        return (pedido.status === 'Em produção' || pedido.status === 'Pronto, aguardando envio') &&
               (pedido.id.toString().includes(termoPesquisa) || pedido.cliente.toLowerCase().includes(termoPesquisa));
    });

    pedidosNaoFinalizados.forEach(pedido => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${pedido.status}`;

        listItem.addEventListener('click', () => {
            exibirDetalhesPedido(pedido);
        });

        listaPedidos.appendChild(listItem);
    });
}


function exibirInputsLote(pedido) {
    const inputsLote = document.getElementById('inputs-lote');
    inputsLote.innerHTML = ''; // Limpa os inputs existentes
    //console.log(pedido)

    pedido.itens.forEach(item => {
        if (item.produto === 'Rapé') {
            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            const label = document.createElement('label');
            label.textContent = `${item.tipo_rape} (${item.quantidade / 2}Kg - ${item.quantidade} Pacotes):`;
            inputGroup.appendChild(label);

            const input = document.createElement('input');
            input.type = 'text';
            input.id = `lote-${item.tipo_rape.replace(/\s+/g, '')}`; // Cria um ID único para o input
            input.placeholder = 'Lote';
            input.value = item.lote || ''; // Define o valor do input com o lote existente, se houver
            inputGroup.appendChild(input);

            inputsLote.appendChild(inputGroup);
            //console.log(pedido)
        }
    });
}

function fecharModalDetalhesPedido() {
    document.getElementById('modal-detalhes-pedido').style.display = 'none';
}

function finalizarPedido(pedido) {
    if (confirm(`Confirma a finalização do pedido nº ${pedido.id}?`)) {
        pedido.status = 'Finalizado';
        pedido.data_finalizacao = new Date().toISOString().slice(0, 19).replace('T', ' '), // Converte para o formato YYYY-MM-DD HH:MM:SS
        pedido.valor_frete = parseFloat(document.getElementById('modal-valor-frete').value) || 0;
        //pedido.produtor = document.getElementById('modal-produtor').value;
        //console.log(pedido)

        // Atualiza o pedido na API
        fetch(`/api/pedidos-finalizados-aguardando-envio/${pedido.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(
                {
                status: 'Finalizado',
                dataFinalizacao: new Date().toISOString().slice(0, 19).replace('T', ' '),
                valorFrete: pedido.valor_frete
                }
        )})
        
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao finalizar pedido.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            //salvarPedidosNoLocalStorage();
            exibirPedidos();
            fecharModalDetalhesPedido();
        })
        .catch(error => {
            alert('Erro ao finalizar pedido.');
            console.error(error);
        });
        exibirPedidos();
        fecharModalDetalhesPedido();
    }
}


function exibirPedidosAguardandoProducao() {
    const listaPedidos = document.getElementById('lista-pedidos-aguardando-producao');
    listaPedidos.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-pedido').value.toLowerCase();

    // Faz uma requisição GET para a API para obter os pedidos
    fetch('/api/pedidos-aguardando-producao', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos.');
        }
        return response.json();
    })
    .then(pedidos => {
        // Filtra os pedidos com base no termo de pesquisa
        const pedidosFiltrados = pedidos.filter(pedido => {
            return (pedido.status === 'Em produção') &&
                   (pedido.id.toString().includes(termoPesquisa) || 
                    pedido.cliente_id.toLowerCase().includes(termoPesquisa) ||
                    pedido.vendedor_id.toLowerCase().includes(termoPesquisa));
        });
//console.log(pedidosFiltrados)
        // Ordena os pedidos por data de criação (mais recentes primeiro)
        pedidosFiltrados.sort((a, b) => b.dataCriacao - a.dataCriacao);

        // Itera sobre os pedidos filtrados e adiciona cada um à lista
        pedidosFiltrados.forEach(pedido => {
            const listItem = document.createElement('li');
            listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor}`;

            listItem.addEventListener('click', () => {
                exibirDetalhesPedido(pedido.id);
            });

            listaPedidos.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar pedidos.');
        console.error(error);
    });
}

function exibirPedidosFinalizadosAguardandoEnvio() {
    const listaPedidos = document.getElementById('lista-pedidos-finalizados-aguardando-envio');
    listaPedidos.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-pedido').value.toLowerCase();

        // Faz uma requisição GET para a API para obter os pedidos
        fetch('/api/pedidos-finalizados-aguardando-envio', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar pedidos.');
            }
            return response.json();
        })
        .then(pedidos => {
            //console.log(pedidos)
            // Filtra os pedidos com base no termo de pesquisa
            const pedidosFiltrados = pedidos.filter(pedido => {
                return pedido.status === 'Pronto, aguardando envio' &&
                       (pedido.id.toString().includes(termoPesquisa) || 
                        pedido.cliente.toLowerCase().includes(termoPesquisa) ||
                        pedido.vendedor.toLowerCase().includes(termoPesquisa));
            });
    
            // Ordena os pedidos por data de criação (mais recentes primeiro)
            pedidosFiltrados.sort((a, b) => b.dataCriacao - a.dataCriacao);
    
            // Itera sobre os pedidos filtrados e adiciona cada um à lista
            pedidosFiltrados.forEach(pedido => {
                const listItem = document.createElement('li');
                listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${pedido.status}`;
    
                listItem.addEventListener('click', () => {
                    exibirDetalhesPedido(pedido.id);
                });
    
                listaPedidos.appendChild(listItem);
            });
        })
        .catch(error => {
            alert('Erro ao buscar pedidos.');
            console.error(error);
        });
    }

function exibirPedidosFinalizados() {
    const listaPedidos = document.getElementById('lista-pedidos-finalizados');
    listaPedidos.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-pedido').value.toLowerCase();

            // Faz uma requisição GET para a API para obter os pedidos
            fetch('/api/pedidos-finalizados', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar pedidos.');
                }
                return response.json();
            })
            .then(vendas => {
    const pedidosFinalizados = vendas.filter(pedido => {
        return pedido.status === 'Finalizado' &&
        (pedido.id.toString().includes(termoPesquisa) || 
        pedido.cliente.toLowerCase().includes(termoPesquisa) ||
        pedido.vendedor.toLowerCase().includes(termoPesquisa)); // Adiciona pesquisa por vendedor
})
.sort((a, b) => b.dataCriacao - a.dataCriacao); // Ordena por data (mais recentes primeiro)

    const inicio = (paginaAtualPedidosFinalizados - 1) * pedidosPorPagina;
    const fim = inicio + pedidosPorPagina;
    const pedidosPaginaAtual = pedidosFinalizados.slice(inicio, fim);

    pedidosPaginaAtual.forEach(pedido => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${pedido.status}`;

        listItem.addEventListener('click', () => {
            exibirDetalhesPedido(pedido.id);
        });

        listaPedidos.appendChild(listItem);
    });

 // Controle de exibição dos botões de paginação
 const btnProximaPagina = document.getElementById('btn-proxima-pagina');
 const btnPaginaAnterior = document.getElementById('btn-pagina-anterior');
 if (fim < pedidosFinalizados.length) {
     btnProximaPagina.style.display = 'block';
 } else {
     btnProximaPagina.style.display = 'none';
 }
 if (paginaAtualPedidosFinalizados > 1) {
     btnPaginaAnterior.style.display = 'block';
 } else {
     btnPaginaAnterior.style.display = 'none';
 }

 // Criação do menu de paginação
 criarMenuPaginacao(pedidosFinalizados.length);
})
 .catch(error => {
    alert('Erro ao buscar pedidos.');
    console.error(error);
});
}

function criarMenuPaginacao(totalPedidos) {
    const menuPaginacao = document.getElementById('menu-paginacao');
    menuPaginacao.innerHTML = ''; // Limpa o menu

    const totalPaginas = Math.ceil(totalPedidos / pedidosPorPagina);
    const paginaInicial = Math.max(1, paginaAtualPedidosFinalizados - 3); // Exibe até 3 páginas antes da atual
    const paginaFinal = Math.min(totalPaginas, paginaInicial + 7); // Exibe até 7 páginas no total

    for (let i = paginaInicial; i <= paginaFinal; i++) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
    
        // Adiciona o evento onclick ao listItem (em vez do link)
        listItem.onclick = () => {
            paginaAtualPedidosFinalizados = i;
            exibirPedidosFinalizados();
        };
    
        listItem.appendChild(link);
        menuPaginacao.appendChild(listItem);

        if (i === paginaAtualPedidosFinalizados) {
            listItem.classList.add('ativo'); // Adiciona a classe 'ativo' ao item da página atual
        }
    }
}

function abrirModalEditarPedido(pedido) {
    alert('AINDA ESTÁ SENDO DESENVOLVIDO')
    //console.log(pedido)
    // Faz uma requisição GET para a API para obter os detalhes do pedido
    fetch(`/api/pedidos/${pedido.id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar pedido.');
        }
        return response.json();
    })
    .then(pedido => {
        //console.log(pedido)
        // Preenche o modal com os detalhes do pedido
        document.getElementById('editar-cliente').textContent = `Cliente: ${pedido.cliente}`;
        document.getElementById('editar-vendedor').textContent = pedido.vendedor;
        document.getElementById('editar-descricao').value = pedido.descricao;
        document.getElementById('editar-moeda').innerHTML = `<option value="${pedido.moeda}">${pedido.moeda}</option>`;
        document.getElementById('editar-valor-venda').value = pedido.valor_venda;
        document.getElementById('editar-valor-pago').value = pedido.valor_pago;
        document.getElementById('editar-status').value = pedido.status;
        document.getElementById('editar-valor-frete').value = pedido.valor_frete;
        document.getElementById('editar-produtor').value = pedido.produtor;
        document.getElementById('editar-saldo-venda').value = calcularSaldoVenda();

        // Preenche os inputs de lote
        const inputsLote = document.getElementById('inputs-lote');
        inputsLote.innerHTML = '';
        pedido.itens.forEach(item => {
            if (item.produtoId === '1') {
                const inputGroup = document.createElement('div');
                inputGroup.classList.add('input-group');

                const label = document.createElement('label');
                label.textContent = `${item.tipoRape} (${item.quantidade / 2}Kg - ${item.quantidade} Pacotes):`;
                inputGroup.appendChild(label);

                const input = document.createElement('input');
                input.type = 'text';
                input.id = `lote-${item.tipoRape.replace(/\s+/g, '')}`;
                input.placeholder = 'Lote';
                input.value = item.lote || '';
                inputGroup.appendChild(input);

                inputsLote.appendChild(inputGroup);
            }
        });
                // Popula os selects de clientes, vendedores e produtores
                //popularSelectClientesEditar();
                popularSelectVendedoresEditar(pedido);
                //popularProdutoresEditar();

        // Exibe o modal
        document.getElementById('modal-editar-pedido').style.display = 'block';
        // Adicione um event listener ao botão "Editar Cliente"
        document.getElementById('salvar-alteracoes').addEventListener('click', () => 
        {
            editarPedido(pedido);
        });
    })
    .catch(error => {
        alert('Erro ao buscar pedido.');
        console.error(error);
    });
}

function calcularSaldoVenda() {
    const valorVenda = parseFloat(document.getElementById('editar-valor-venda').value) || 0;
    const valorPago = parseFloat(document.getElementById('editar-valor-pago').value) || 0;
    saldo = valorPago - valorVenda;

    document.getElementById('editar-saldo-venda').textContent = `${saldo.toFixed(2)}`;
}

function fecharModalEditarPedido() {
    document.getElementById('modal-editar-pedido').style.display = 'none';
}

function editarPedido(pedido) {
console.log(pedido)
    // Atualiza o pedido na API
    fetch(`/api/pedidos/${pedido.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            //cliente: document.getElementById('editar-cliente').value,
            //vendedor: document.getElementById('editar-vendedor').value,
            //descricao: document.getElementById('editar-descricao').value,
            //moeda: document.getElementById('editar-moeda').value,
            //valorVenda: parseFloat(document.getElementById('editar-valor-venda').value),
            //valorPago: parseFloat(document.getElementById('editar-valor-pago').value),
            //status: document.getElementById('editar-status').value,
            //valorFrete: parseFloat(document.getElementById('editar-valor-frete').value),
            //produtor: document.getElementById('editar-produtor').value,
            //saldoVenda: parseFloat(document.getElementById('editar-saldo-venda').value),
            /*itens: [
                // ... (lógica para obter os lotes dos itens) ...
            ]*/
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar pedido.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        fecharModalEditarPedido();
        fecharModalDetalhesPedido();
        exibirPedidos();
    })
    .catch(error => {
        alert('Erro ao atualizar pedido.');
        console.error(error);
    });
};

// Funções para popular os selects no modal de edição
function popularSelectClientesEditar() {
    const selectCliente = document.getElementById('editar-cliente');
    selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>';

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

function popularSelectVendedoresEditar(pedido) {
    const selectVendedor = document.getElementById('editar-vendedor');
    selectVendedor.innerHTML = `<option value="${pedido.vendedor_id}">${pedido.vendedor}</option>`;

    fetch('/api/funcionarios', {
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

function popularProdutoresEditar() {
    const selectProdutor = document.getElementById('editar-produtor');
    selectProdutor.innerHTML = '<option value="">Selecione o Produtor</option>';

    fetch('/api/produtores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar produtores.');
        }
        return response.json();
    })
    .then(produtores => {
        produtores.forEach(produtor => {
            const option = document.createElement('option');
            option.value = produtor.id;
            option.textContent = produtor.nome;
            selectProdutor.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar produtores.');
        console.error(error);
    });
}
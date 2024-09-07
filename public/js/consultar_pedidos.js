// consultar_pedidos.js - lógica da página consultar_pedidos.html

document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    //carregarClientesDoLocalStorage();
    //carregarPedidosDoLocalStorage();
    exibirPedidos();
    //carregarFuncionariosDoLocalStorage();

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

/*function popularProdutores() {
    const selectProdutor = document.getElementById('modal-produtor');

    selectProdutor.innerHTML = '<option value="">Selecione o Produtor</option>'; // Limpa as opções existentes

    // Verifica se produtores está definido e se o array não está vazio
    if (typeof produtores !== 'undefined' && produtores.length > 0) { 
        produtores.forEach(produtor => {
            const option = document.createElement('option');
            option.value = produtor; // Define o valor da opção como o nome do produtor
            option.textContent = produtor; // Define o texto da opção como o nome do produtor
            selectProdutor.appendChild(option);
        });
    } else {
        alert("Não existem produtores cadastrados, por favor cadastre um produtor!");
        //window.location.href = 'funcionarios.html';
    }
}*/
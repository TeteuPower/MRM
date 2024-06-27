// consultar_pedidos.js - lógica da página consultar_pedidos.html

document.addEventListener('DOMContentLoaded', function () {
    carregarClientesDoLocalStorage();
    carregarPedidosDoLocalStorage();
    exibirPedidos();

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
        listItem.textContent = `Pedido nº ${pedido.id} - ${pedido.cliente} - ${pedido.status}`;

        listItem.addEventListener('click', () => {
            exibirDetalhesPedido(pedido);
        });

        listaPedidos.appendChild(listItem);
    });
}


function exibirDetalhesPedido(pedido) {
    document.getElementById('modal-numero-pedido').textContent = `Detalhes do Pedido nº ${pedido.id}`;
    document.getElementById('modal-cliente').textContent = pedido.cliente;
    document.getElementById('modal-vendedor').textContent = pedido.vendedor;
    document.getElementById('modal-descricao').textContent = pedido.descricao;
    document.getElementById('modal-data-criacao').textContent = formatarData(pedido.dataCriacao);
    document.getElementById('modal-valor-venda').textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valorVenda.toFixed(2)}`;
    document.getElementById('modal-valor-pago').textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valorPago.toFixed(2)}`;
    document.getElementById('modal-status').textContent = pedido.status;

        // Controle de exibição da área de lote
        const areaLote = document.getElementById('area-lote');
        if (pedido.status === 'Em produção') {
            areaLote.style.display = 'block';
            exibirInputsLote(pedido); // Chama a função para exibir os inputs de lote
    
            // Adiciona evento ao botão "Pronto, aguardando envio"
            const btnAtualizarStatus = document.getElementById('btn-atualizar-status');
            btnAtualizarStatus.onclick = () => {
                atualizarStatusPedido(pedido);
            };
        } else {
            areaLote.style.display = 'none';
        }

        function atualizarStatusPedido(pedido) {
            const lotes = {};
            let todosOsLotesPreenchidos = true;
        
            pedido.itens.forEach(item => {
                if (item.produto === 'rape') {
                    const inputId = `lote-${item.tipoRape.replace(/\s+/g, '')}`;
                    const lote = document.getElementById(inputId).value.trim();
                    if (lote === '') {
                        todosOsLotesPreenchidos = false;
                        return; // Sai do loop se algum lote estiver vazio
                    }
                    lotes[item.tipoRape] = lote;
                }
            });
        
            if (!todosOsLotesPreenchidos) {
                alert('Por favor, preencha todos os lotes!');
                return;
            }
        
            if (confirm(`Confirma a atualização do status do pedido nº ${pedido.id} para "Pronto, aguardando envio"?`)) {
                pedido.status = 'Pronto, aguardando envio';
                pedido.itens.forEach(item => {
                    if (item.produto === 'rape') {
                        item.lote = lotes[item.tipoRape];
                    }
                });
                salvarPedidosNoLocalStorage();
                exibirPedidos();
                fecharModalDetalhesPedido();
            }
        }

    // Exibe os itens do pedido na tabela
    const tbodyItens = document.getElementById('modal-tabela-itens').getElementsByTagName('tbody')[0];
    tbodyItens.innerHTML = ''; // Limpa a tabela
    pedido.itens.forEach(item => {
        const row = tbodyItens.insertRow();
        const cellProduto = row.insertCell();
        const cellQuantidade = row.insertCell();
        const cellLote = row.insertCell();

        let nomeProduto = item.produto;
        if (item.produto === 'rape' && item.tipoRape) {
            nomeProduto += ` (${item.tipoRape})`;
        }

        cellProduto.textContent = nomeProduto;
        cellQuantidade.textContent = item.quantidade;
        cellLote.textContent = item.lote || '-'; // Exibe o lote se existir, caso contrário, exibe "-"
    });

    // Controle de exibição das áreas de frete e nota fiscal
    const areaFrete = document.getElementById('area-frete');
    const areaNotaFiscal = document.getElementById('area-nota-fiscal');
    const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');
    const btnAdicionarNotaFiscal = document.getElementById('btn-adicionar-nota-fiscal');
    const btnConsultarNotaFiscal = document.getElementById('btn-consultar-nota-fiscal');

    if (pedido.status === 'Pronto, aguardando envio') {
        areaFrete.style.display = 'block';
        areaNotaFiscal.style.display = 'block';
        btnFinalizarPedido.onclick = () => {
            finalizarPedido(pedido);
        };

        // Se já tiver nota fiscal, exibe o botão "Consultar" e oculta o botão "Adicionar"
        if (pedido.notaFiscal) {
            btnAdicionarNotaFiscal.style.display = 'none';
            btnConsultarNotaFiscal.style.display = 'block';
            btnConsultarNotaFiscal.onclick = () => {
                // Implemente a lógica para consultar a nota fiscal aqui
                console.log('Consultar nota fiscal do pedido:', pedido.id);
            };
        } else {
            btnAdicionarNotaFiscal.style.display = 'block';
            btnConsultarNotaFiscal.style.display = 'none';
            btnAdicionarNotaFiscal.onclick = () => {
                // Implemente a lógica para adicionar a nota fiscal aqui
                console.log('Adicionar nota fiscal ao pedido:', pedido.id);
            };
        }
    } else {
        areaFrete.style.display = 'none';
        areaNotaFiscal.style.display = 'none';
    }

        // Preenche o valor do frete
        const valorFreteExibicao = document.getElementById('modal-valor-frete-exibicao');
        if (pedido.valorFrete) {
            valorFreteExibicao.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valorFrete.toFixed(2)}`;
        } else {
            valorFreteExibicao.textContent = '-'; // Ou qualquer outro valor padrão se o frete não estiver definido
        }

    // Exibe o modal
    document.getElementById('modal-detalhes-pedido').style.display = 'block';
}

function exibirInputsLote(pedido) {
    const inputsLote = document.getElementById('inputs-lote');
    inputsLote.innerHTML = ''; // Limpa os inputs existentes

    pedido.itens.forEach(item => {
        if (item.produto === 'rape') {
            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            const label = document.createElement('label');
            label.textContent = `${item.tipoRape} (${item.quantidade / 2}Kg - ${item.quantidade} Pacotes):`;
            inputGroup.appendChild(label);

            const input = document.createElement('input');
            input.type = 'text';
            input.id = `lote-${item.tipoRape.replace(/\s+/g, '')}`; // Cria um ID único para o input
            input.placeholder = 'Lote';
            input.value = item.lote || ''; // Define o valor do input com o lote existente, se houver
            inputGroup.appendChild(input);

            inputsLote.appendChild(inputGroup);
        }
    });
}

function fecharModalDetalhesPedido() {
    document.getElementById('modal-detalhes-pedido').style.display = 'none';
}

function finalizarPedido(pedido) {
    if (confirm(`Confirma a finalização do pedido nº ${pedido.id}?`)) {
        pedido.status = 'Finalizado';
        pedido.valorFrete = parseFloat(document.getElementById('modal-valor-frete').value) || 0;
        pedido.produtor = document.getElementById('modal-produtor').value;
        salvarPedidosNoLocalStorage();
        exibirPedidos();
        fecharModalDetalhesPedido();
    }
}

function formatarData(data) {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

function exibirPedidosAguardandoProducao() {
    const listaPedidos = document.getElementById('lista-pedidos-aguardando-producao');
    listaPedidos.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-pedido').value.toLowerCase();

    const pedidosAguardandoProducao = vendas.filter(pedido => {
        return pedido.status === 'Em produção' &&
        (pedido.id.toString().includes(termoPesquisa) || 
        pedido.cliente.toLowerCase().includes(termoPesquisa) ||
        pedido.vendedor.toLowerCase().includes(termoPesquisa)); // Adiciona pesquisa por vendedor
    })
    .sort((a, b) => b.dataCriacao - a.dataCriacao); // Ordena por data (mais recentes primeiro)

    pedidosAguardandoProducao.forEach(pedido => {
        const listItem = document.createElement('li');
        listItem.textContent = `Pedido nº ${pedido.id} - ${pedido.cliente} - ${pedido.status}`;

        listItem.addEventListener('click', () => {
            exibirDetalhesPedido(pedido);
        });

        listaPedidos.appendChild(listItem);
    });
}

function exibirPedidosFinalizadosAguardandoEnvio() {
    const listaPedidos = document.getElementById('lista-pedidos-finalizados-aguardando-envio');
    listaPedidos.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-pedido').value.toLowerCase();

    const pedidosFinalizadosAguardandoEnvio = vendas.filter(pedido => {
        return pedido.status === 'Pronto, aguardando envio' &&
        (pedido.id.toString().includes(termoPesquisa) || 
        pedido.cliente.toLowerCase().includes(termoPesquisa) ||
        pedido.vendedor.toLowerCase().includes(termoPesquisa)); // Adiciona pesquisa por vendedor
})
.sort((a, b) => b.dataCriacao - a.dataCriacao); // Ordena por data (mais recentes primeiro)

    pedidosFinalizadosAguardandoEnvio.forEach(pedido => {
        const listItem = document.createElement('li');
        listItem.textContent = `Pedido nº ${pedido.id} - ${pedido.cliente} - ${pedido.status}`;

        listItem.addEventListener('click', () => {
            exibirDetalhesPedido(pedido);
        });

        listaPedidos.appendChild(listItem);
    });
}

function exibirPedidosFinalizados() {
    const listaPedidos = document.getElementById('lista-pedidos-finalizados');
    listaPedidos.innerHTML = ''; // Limpa a lista

    const termoPesquisa = document.getElementById('pesquisa-pedido').value.toLowerCase();

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
        listItem.textContent = `Pedido nº ${pedido.id} - ${pedido.cliente} - ${pedido.status}`;

        listItem.addEventListener('click', () => {
            exibirDetalhesPedido(pedido);
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


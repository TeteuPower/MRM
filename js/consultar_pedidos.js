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
        pedido.dataFinalizacao = new Date(); // Define a data de finalização
        pedido.valorFrete = parseFloat(document.getElementById('modal-valor-frete').value) || 0;
        pedido.produtor = document.getElementById('modal-produtor').value;
        salvarPedidosNoLocalStorage();
        exibirPedidos();
        fecharModalDetalhesPedido();
    }
}

function formatarData(data) {
    if (data === null) {
        return '-'; // Ou qualquer outro valor padrão que você queira exibir quando a data for nula
    }
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
        listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${pedido.status}`;

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
        listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${pedido.status}`;

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
        listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${pedido.status}`;

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


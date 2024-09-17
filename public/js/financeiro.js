// financeiro.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                exibirResumoFinanceiro();
                exibirPedidosAdministrador();
            }
        });
});

function exibirResumoFinanceiro() {
    const administradorId = parseInt(localStorage.getItem('administrador'));

    fetch(`/api/financeiro/${administradorId}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar resumo financeiro.');
        }
        return response.json();
    })
    .then(resumo => {
        console.log(resumo)
        document.getElementById('vendas-totais').textContent = `R$ ${parseInt(resumo.vendas_totais_reais).toFixed(2)}`;
        document.getElementById('vendas-totais-dolares').textContent = `US$ ${parseInt(resumo.vendas_totais_dolares).toFixed(2)}`;
        document.getElementById('repasses-recebidos').textContent = `R$ ${parseInt(resumo.repasses_recebidos_reais).toFixed(2)}`;
        document.getElementById('repasses-recebidos-dolares').textContent = `US$ ${parseInt(resumo.repasses_recebidos_dolares).toFixed(2)}`;
        document.getElementById('gastos-administrador').textContent = `R$ ${parseInt(resumo.gastos_vendedor_reais).toFixed(2)}`;
        //document.getElementById('media-salarial').textContent = `R$ ${((resumo.vendas_totais_reais - resumo.gastos_administrador_reais) / 30).toFixed(2)}`;
        //document.getElementById('media-salarial-dolares').textContent = `US$ ${((resumo.vendas_totais_dolares - resumo.gastos_administrador_dolares) / 30).toFixed(2)}`;
        document.getElementById('vendedor-repasse').textContent = 'Rafael'; // Substitua por uma lógica para obter o vendedor do repasse
    })
    .catch(error => {
        alert('Erro ao buscar resumo financeiro.');
        console.error(error);
    });
}

let paginaAtualPedidosAdministrador = 1;
const pedidosPorPagina = 5;

function exibirPedidosAdministrador() {
    const administradorId = parseInt(localStorage.getItem('administrador'));

    fetch(`/api/financeiro/pedidos/${administradorId}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos do administrador.');
        }
        return response.json();
    })
    .then(pedidos => {
        const listaPedidos = document.getElementById('lista-pedidos-administrador');
        listaPedidos.innerHTML = ''; // Limpa a lista

        const inicio = (paginaAtualPedidosAdministrador - 1) * pedidosPorPagina;
        const fim = inicio + pedidosPorPagina;
        const pedidosPaginaAtual = pedidos.slice(inicio, fim);

        pedidosPaginaAtual.forEach(pedido => {
            const listItem = document.createElement('li');
            listItem.textContent = `Pedido nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${pedido.status}`;

            listItem.addEventListener('click', () => {
                exibirDetalhesPedido(pedido);
            });

            listaPedidos.appendChild(listItem);
        });

        // Controle de exibição dos botões de paginação
        const btnProximaPagina = document.getElementById('btn-proxima-pagina-pedidos-administrador');
        const btnPaginaAnterior = document.getElementById('btn-pagina-anterior-pedidos-administrador');
        if (fim < pedidos.length) {
            btnProximaPagina.style.display = 'block';
        } else {
            btnProximaPagina.style.display = 'none';
        }
        if (paginaAtualPedidosAdministrador > 1) {
            btnPaginaAnterior.style.display = 'block';
        } else {
            btnPaginaAnterior.style.display = 'none';
        }

        // Criação do menu de paginação
        criarMenuPaginacaoPedidosAdministrador(pedidos.length);
    })
    .catch(error => {
        alert('Erro ao buscar pedidos do administrador.');
        console.error(error);
    });
}

function criarMenuPaginacaoPedidosAdministrador(totalPedidos) {
    const menuPaginacao = document.getElementById('menu-paginacao-pedidos-administrador');
    menuPaginacao.innerHTML = ''; // Limpa o menu

    const totalPaginas = Math.ceil(totalPedidos / pedidosPorPagina);
    const paginaInicial = Math.max(1, paginaAtualPedidosAdministrador - 3);
    const paginaFinal = Math.min(totalPaginas, paginaInicial + 7);

    for (let i = paginaInicial; i <= paginaFinal; i++) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        link.onclick = () => {
            paginaAtualPedidosAdministrador = i;
            exibirPedidosAdministrador();
        };
        listItem.appendChild(link);
        menuPaginacao.appendChild(listItem);

        if (i === paginaAtualPedidosAdministrador) {
            listItem.classList.add('ativo');
        }
    }
}

// Adicione event listeners aos botões de paginação
document.getElementById('btn-proxima-pagina-pedidos-administrador').addEventListener('click', () => {
    paginaAtualPedidosAdministrador++;
    exibirPedidosAdministrador();
});

document.getElementById('btn-pagina-anterior-pedidos-administrador').addEventListener('click', () => {
    paginaAtualPedidosAdministrador--;
    exibirPedidosAdministrador();
});

// ... (seu código existente) ...
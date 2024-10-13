// gastos.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                popularSelectAdministradores();
                exibirSaldoEmpresa();
                document.getElementById('form-gasto-empresa').addEventListener('submit', registrarGasto);
                exibirExtratoCaixa();
            }
        });
});

function exibirSaldoEmpresa() {
    const textoSaldoEmpresa = document.getElementById('saldo-empresa');
    const textoSaldoEmpresa2 = document.getElementById('saldo-empresa2');

    fetch('/api/gastos/saldo-empresa', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar saldo da empresa.');
        }
        return response.json();
    })
    .then(async saldo => {
        const saldoTotal = (parseFloat(saldo.saldo_empresa_reais).toFixed(2) + await converterDolarParaReal(parseFloat(saldo.saldo_empresa_dolares).toFixed(2)));
        textoSaldoEmpresa.textContent = `Saldo no caixa da empresa: R$ ${formatarValor(parseFloat(saldoTotal).toFixed(2))}`;
        textoSaldoEmpresa2.textContent = `Saldo R$ ${formatarValor(parseFloat(saldoTotal).toFixed(2))}`;
    })
    .catch(error => {
        alert('Erro ao buscar saldo da empresa.');
        console.error(error);
    });
}

function popularSelectAdministradores() {
    const selectVendedor = document.getElementById('administrador-gasto');
    selectVendedor.innerHTML = '<option value="">Quem comprou?</option>';

    fetch('/api/pagamentos/administradores', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar os administradores.');
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
        alert('Erro ao buscar os administradores.');
        console.error(error);
    });
}

function registrarGasto(event) {
    event.preventDefault();

    const descricao = document.getElementById('descricao-gasto').value;
    const valor = parseFloat(document.getElementById('valor-gasto').value);
    const moeda = document.getElementById('moeda-gasto').value;
    const administradorId = parseFloat(document.getElementById('administrador-gasto').value);
    //console.log(descricao,valor,moeda,administradorId)

    if (descricao === '' || isNaN(valor) || valor <= 0 || administradorId === '') {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    fetch('/api/gastos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ descricao, valor, moeda, administradorId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao registrar gasto.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        event.target.reset();
        location.reload();
    })
    .catch(error => {
        alert('Erro ao registrar gasto.');
        console.error(error);
    });
}

let paginaAtualExtrato = 1;
const itensPorPagina = 10;

function exibirExtratoCaixa() {
    const tbodyExtrato = document.getElementById('tabela-extrato-caixa').getElementsByTagName('tbody')[0];
    tbodyExtrato.innerHTML = ''; // Limpa a tabela

    // Faz uma requisição GET para a API para obter os repasses para a empresa
    fetch('/api/divisao-lucros/repasses-empresa-administrador', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar repasses para a empresa.');
        }
        return response.json();
    })
    .then(repasses => {
        // Faz uma requisição GET para a API para obter os gastos
        fetch('/api/gastos', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar gastos.');
            }
            return response.json();
        })
        .then(gastos => {
            // Combina os repasses e gastos em um único array
            const itensExtrato = [...repasses, ...gastos];

            // Ordena os itens do extrato por data (mais recentes primeiro)
            itensExtrato.sort((a, b) => new Date(b.data) - new Date(a.data));

            const inicio = (paginaAtualExtrato - 1) * itensPorPagina;
            const fim = inicio + itensPorPagina;
            const itensPaginaAtual = itensExtrato.slice(inicio, fim);

            itensPaginaAtual.forEach(item => {
                const row = tbodyExtrato.insertRow();
                const cellData = row.insertCell();
                const cellDescricao = row.insertCell();
                const cellValor = row.insertCell();
                //const cellMoeda = row.insertCell();
                const cellAdministrador = row.insertCell();
                //const cellVendedor = row.insertCell();
                //const cellPedido = row.insertCell();

                cellData.textContent = formatarData(item.data);

                if (item.pedido_id) {
                    cellDescricao.textContent = `Repasse para a Empresa - Pedido nº ${item.pedido_id}`;
                    //Troca a cor do testo cellDescricao para verde
                    cellValor.textContent = `${item.moeda === 'real' ? 'R$' : 'US$'} +${item.valor}`;
                    cellValor.style.color = 'green';
                    
                    //cellVendedor.textContent = item.vendedor;
                    //cellPedido.textContent = item.pedido_id;
                } else {
                    cellDescricao.textContent = item.descricao;
                    cellValor.textContent = `${item.moeda === 'real' ? 'R$' : 'US$'} -${item.valor}`;
                    cellValor.style.color = 'red';
                }


                //cellMoeda.textContent = item.moeda;
                cellAdministrador.textContent = item.administrador;

                // Oculta a coluna "Vendedor" se for um gasto
                if (!item.vendedor) {
                    //cellVendedor.style.display = 'none';
                    //cellPedido.style.display = 'none';
                }
            });

            // Controle de exibição dos botões de paginação
            const btnProximaPagina = document.getElementById('btn-proxima-pagina-extrato');
            const btnPaginaAnterior = document.getElementById('btn-pagina-anterior-extrato');
            if (fim < itensExtrato.length) {
                btnProximaPagina.style.display = 'block';
            } else {
                btnProximaPagina.style.display = 'none';
            }
            if (paginaAtualExtrato > 1) {
                btnPaginaAnterior.style.display = 'block';
            } else {
                btnPaginaAnterior.style.display = 'none';
            }

            // Criação do menu de paginação
            criarMenuPaginacaoExtrato(itensExtrato.length);
        })
        .catch(error => {
            alert('Erro ao buscar repasses para a empresa ou gastos.');
            console.error(error);
        });
    })
    .catch(error => {
        alert('Erro ao buscar repasses para a empresa.');
        console.error(error);
    });
}

function criarMenuPaginacaoExtrato(totalItens) {
    const menuPaginacao = document.getElementById('menu-paginacao-extrato');
    menuPaginacao.innerHTML = ''; // Limpa o menu

    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    const paginaInicial = Math.max(1, paginaAtualExtrato - 3);
    const paginaFinal = Math.min(totalPaginas, paginaInicial + 7);

    for (let i = paginaInicial; i <= paginaFinal; i++) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        link.onclick = () => {
            paginaAtualExtrato = i;
            exibirExtratoCaixa();
        };
        listItem.appendChild(link);
        menuPaginacao.appendChild(listItem);

        if (i === paginaAtualExtrato) {
            listItem.classList.add('ativo');
        }
    }
}

// Adicione event listeners aos botões de paginação
document.getElementById('btn-proxima-pagina-extrato').addEventListener('click', () => {
    paginaAtualExtrato++;
    exibirExtratoCaixa();
});

document.getElementById('btn-pagina-anterior-extrato').addEventListener('click', () => {
    paginaAtualExtrato--;
    exibirExtratoCaixa();
});
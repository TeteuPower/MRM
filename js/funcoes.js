// funcoes.js

// Função para salvar a lista de clientes no Local Storage
function salvarClientesNoLocalStorage() {
    localStorage.setItem('clientes', JSON.stringify(window.clientes));
}

// Função para carregar a lista de clientes do Local Storage
function carregarClientesDoLocalStorage() {
    const clientesStorage = localStorage.getItem('clientes');
    if (clientesStorage) {
        window.clientes = JSON.parse(clientesStorage, (key, value) => {
            if (key === 'pagamentos') {
                return value.map(pagamento => ({
                    ...pagamento,
                    data: new Date(pagamento.data) // Converte a string de data para um objeto Date
                }));
            }
            return value;
        });
    } else {
        window.clientes = []; // Inicializa como um array vazio se não houver dados no Local Storage
    }
}

function gerarIdVenda() {
    const novoId = proximaIdVenda;
    proximaIdVenda++;
    return novoId;
}

function salvarVendasNoLocalStorage() {
    localStorage.setItem('vendas', JSON.stringify(vendas));
    localStorage.setItem('proximaIdVenda', proximaIdVenda);
}

function carregarVendasDoLocalStorage() {
    const vendasStorage = localStorage.getItem('vendas');
    if (vendasStorage) {
        vendas = JSON.parse(vendasStorage);
    } else {
        vendas = [];
    }

    const proximaIdVendaStorage = localStorage.getItem('proximaIdVenda');
    if (proximaIdVendaStorage) {
        proximaIdVenda = parseInt(proximaIdVendaStorage);
    } else {
        proximaIdVenda = 1;
    }
}

// Função para salvar o estoque no Local Storage (crie esta função em funcoes.js)

function salvarEstoqueNoLocalStorage() {
    localStorage.setItem('estoque', JSON.stringify(window.estoque));
}

function carregarEstoqueDoLocalStorage() {
    const estoqueStorage = localStorage.getItem('estoque');
    if (estoqueStorage) {
        window.estoque = JSON.parse(estoqueStorage);
    } else {
        // Define o estoque inicial se não houver dados no Local Storage
        window.estoque = {
            rape: {
                total: 100, 
                variedades: {
                    CHACRONA: 20,
                    "JUREMA BRANCA": 15,
                    SAMSARA: 5,
                    ANGICO: 10,
                    JATOBA: 8,
                    CINNAMON: 6,
                    NUTMEG: 12,
                    "NUKINI JAGUAR": 7,
                    "YAWANAWA FF": 9,
                    BOBINSANA: 4,
                    TSUNU: 11,
                    MURICI: 3,
                    CACAU: 2,
                    CUMARU: 1,
                    JUREMA: 18,
                    VASHAWÁ: 16,
                    "PAU PEREIRA(PARICÁ)": 14,
                    MULATEIRO: 13,
                    "RED TSUNU": 19,
                    "CANELA DE VELHO": 21,
                    "7 HIERBAS": 17,
                    "PAU BRASIL": 22 
                }
            },
            couripes: 25, 
            sananga: 50,  
            artesanatos: 15, 
            materiaisPrimas: {
                cinzas: {
                    total: 80, 
                    variedades: {
                        CHACRONA: 10,
                        "JUREMA BRANCA": 8,
                        SAMSARA: 5,
                        ANGICO: 12
                    }
                },
                tabaco: 40,
                pacotes: 120, 
                adesivosGrandes: 95
            }
        };
    }
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

function carregarPedidosDoLocalStorage() {
    const pedidosStorage = localStorage.getItem('vendas');
    if (pedidosStorage) {
        vendas = JSON.parse(pedidosStorage, (key, value) => {
            if (key === 'dataCriacao') {
                return new Date(value); // Converte a string de data para um objeto Date
            }
            return value;
        });
    } else {
        vendas = []; // Inicia um array vazio se não houver vendas
    }
}

function salvarPedidosNoLocalStorage() {
    // Antes de salvar, converta os objetos Date para strings
    const vendasParaSalvar = vendas.map(venda => {
        return {
            ...venda,
            dataCriacao: venda.dataCriacao.toISOString() // Converte Date para string ISO
        };
    });

    localStorage.setItem('vendas', JSON.stringify(vendasParaSalvar));
}
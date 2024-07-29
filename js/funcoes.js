// funcoes.js

document.addEventListener('DOMContentLoaded', function() {
    exibirNomeAdministrador(); // Exibe o nome do administrador
    //Lógica para o header hamburguer
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    hamburgerMenu.addEventListener('click', function() {
        // Alterna a classe 'active' no botão hambúrguer para animá-lo
        hamburgerMenu.classList.toggle('active');

        // Exibe ou oculta o menu móvel
        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Adiciona um event listener ao botão de logout
    document.getElementById('btn-logout').addEventListener('click', function() {
        // Remove a chave "administrador" do Local Storage
        localStorage.removeItem('administrador');

        // Redireciona para a página de login
        window.location.href = '../index.html'; // Ajuste o caminho para a página de login, se necessário
    });
    document.getElementById('btn-logout-mobile').addEventListener('click', function() {
        // Remove a chave "administrador" do Local Storage
        localStorage.removeItem('administrador');

        // Redireciona para a página de login
        window.location.href = '../index.html'; // Ajuste o caminho para a página de login, se necessário
    });
});


// Função para salvar a lista de clientes no Local Storage
function salvarClientesNoLocalStorage() {
    const clientesParaSalvar = clientes.map(cliente => ({
        ...cliente,
        pagamentos: cliente.pagamentos.map(pagamento => ({
            ...pagamento,
            data: pagamento.data.toISOString()
        }))
    }));
    localStorage.setItem('clientes', JSON.stringify(clientesParaSalvar));
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

function carregarFuncionariosDoLocalStorage() {
    let vendedores = []; // Declara vendedores como um array vazio
    let produtores = []; // Declara vendedores como um array vazio
    const vendedoresStorage = localStorage.getItem('vendedores');
    if (vendedoresStorage) {
        vendedores = JSON.parse(vendedoresStorage);
    } 

    window.vendedores = vendedores; // Define vendedores no escopo global

    const produtoresStorage = localStorage.getItem('produtores');
    if (produtoresStorage) {
        produtores = JSON.parse(produtoresStorage);
    } 
    window.produtores = produtores; // Define vendedores no escopo global
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
                total: 0, 
                variedades: {
                    CHACRONA: 0,
                    "JUREMA BRANCA": 0,
                    SAMSARA: 0,
                    ANGICO: 0,
                    JATOBA: 0,
                    CINNAMON: 0,
                    NUTMEG: 0,
                    "NUKINI JAGUAR": 0,
                    "YAWANAWA FF": 0,
                    BOBINSANA: 0,
                    TSUNU: 0,
                    MURICI: 0,
                    CACAU: 0,
                    CUMARU: 0,
                    JUREMA: 0,
                    VASHAWÁ: 0,
                    "PAU PEREIRA(PARICÁ)": 0,
                    MULATEIRO: 0,
                    "RED TSUNU": 0,
                    "CANELA DE VELHO": 0,
                    "7 HIERBAS": 0,
                    "PAU BRASIL": 0
                }
            },
            couripes: 0, 
            sananga: 0,  
            artesanatos: 0, 
            materiaisPrimas: {
                cinzas: {
                    total: 0, 
                    variedades: {
                        CHACRONA: 0,
                        "JUREMA BRANCA": 0,
                        SAMSARA: 0,
                        ANGICO: 0,
                        JATOBA: 0,
                        CINNAMON: 0,
                        NUTMEG: 0,
                        "NUKINI JAGUAR": 0,
                        "YAWANAWA FF": 0,
                        BOBINSANA: 0,
                        TSUNU: 0,
                        MURICI: 0,
                        CACAU: 0,
                        CUMARU: 0,
                        JUREMA: 0,
                        VASHAWÁ: 0,
                        "PAU PEREIRA(PARICÁ)": 0,
                        MULATEIRO: 0,
                        "RED TSUNU": 0,
                        "CANELA DE VELHO": 0,
                        "7 HIERBAS": 0,
                        "PAU BRASIL": 0
                    }
                },
                tabaco: 0,
                pacotes: 0, 
                adesivosGrandes: 0
            }
        };
    }
}

function exibirDetalhesPedido(pedido) {
    const solicitadoPor = pedido.vendaAdministrador ? pedido.vendaAdministrador : 'Cliente'; // Obtém o nome do administrador ou "Cliente"
    document.getElementById('modal-numero-pedido').textContent = `Detalhes do Pedido nº ${pedido.id}`;
    document.getElementById('modal-cliente').textContent = pedido.cliente;
    document.getElementById('modal-vendedor').textContent = pedido.vendedor;
    document.getElementById('modal-descricao').textContent = pedido.descricao;
    document.getElementById('modal-data-criacao').textContent = formatarData(pedido.dataCriacao); //Data que o pedido foi criado
    document.getElementById('modal-data-producao').textContent = formatarData(pedido.dataProducao); //Data que o pedido foi produzido
    document.getElementById('modal-data-finalizacao').textContent = formatarData(pedido.dataFinalizacao); //Data que o pedido foi finalizado
    document.getElementById('modal-valor-venda').textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valorVenda.toFixed(2)}`;
    document.getElementById('modal-valor-pago').textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.valorPago.toFixed(2)}`;
    document.getElementById('modal-status').textContent = pedido.status;
    document.getElementById('modal-saldoVenda').textContent = pedido.saldoVenda === 0 ? 'Pago' : `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${pedido.saldoVenda.toFixed(2)}`;
    document.getElementById('modal-solicitado-por').textContent = solicitadoPor;
    document.getElementById('modal-produtor-span').textContent = pedido.produtor;


        // Controle de exibição da área de lote
        const areaLote = document.getElementById('area-lote');
        if (pedido.status === 'Em produção') {
            areaLote.style.display = 'block';
            popularProdutores(); // Chama a função para popular o select de produtores
            exibirInputsLote(pedido); // Chama a função para exibir os inputs de lote
    
            // Adiciona evento ao botão "Pronto, aguardando envio"
            const btnAtualizarStatus = document.getElementById('btn-atualizar-status');
            btnAtualizarStatus.onclick = () => {
                pedido.produtor = document.getElementById('modal-produtor').value;
                atualizarStatusPedido(pedido);
                salvarPedidosNoLocalStorage();
                exibirPedidos();
                fecharModalDetalhesPedido();
                atualizarPedidoNoCliente(pedido); // Atualiza o pedido dentro da array do cliente
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

            // Verifica se um produtor foi selecionado
            const produtor = document.getElementById('modal-produtor').value;
            if (produtor === '') {
                alert('Por favor, selecione um produtor!');
                return;
            }
        
            if (!todosOsLotesPreenchidos) {
                alert('Por favor, preencha todos os lotes!');
                return;
            }
        
            if (confirm(`Confirma a atualização do status do pedido nº ${pedido.id} para "Pronto, aguardando envio"?`)) {
                pedido.produtor = produtor; // Atribui o produtor ao pedido
                pedido.status = 'Pronto, aguardando envio';
                pedido.dataProducao = new Date(); // Define a data de produção
                pedido.itens.forEach(item => {
                    if (item.produto === 'rape') {
                        item.lote = lotes[item.tipoRape];
                    }
                });
                salvarPedidosNoLocalStorage();
                exibirPedidos();
                fecharModalDetalhesPedido();
                atualizarPedidoNoCliente(pedido); // Atualiza o pedido dentro da array do cliente
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
        cellLote.textContent = item.lote || 'Não informado'; // Exibe o lote se existir, caso contrário, exibe "-"
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
            valorFreteExibicao.textContent = 'Não informado'; // Ou qualquer outro valor padrão se o frete não estiver definido
        }

    // Exibe o modal
    document.getElementById('modal-detalhes-pedido').style.display = 'block';
}

function carregarPedidosDoLocalStorage() {
    const pedidosStorage = localStorage.getItem('vendas');
    if (pedidosStorage) {
        vendas = JSON.parse(pedidosStorage, (key, value) => {
            if (key === 'dataCriacao' || key === 'dataProducao' || key === 'dataFinalizacao') {
                return value ? new Date(value) : null; // Converte apenas se value não for null ou vazio a string de data para um objeto Date
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
            dataCriacao: venda.dataCriacao.toISOString(), // Converte Date para string ISO
            //dataProducao: venda.dataProducao.toISOString(),
            //dataFinalizacao: venda.dataFinalizacao.toISOString(),
        };
    });

    localStorage.setItem('vendas', JSON.stringify(vendasParaSalvar));
}

function atualizarSaldoCliente(venda) {
    const cliente = clientes.find(c => c.nome === venda.cliente);

    if (cliente) {
        if (venda.moeda === 'real') {
            cliente.saldoReais += venda.valorPago - venda.valorVenda;
        } else {
            cliente.saldoDolares += venda.valorPago - venda.valorVenda;
        }
        cliente.pedidos.push(venda); // Adiciona o pedido ao array pedidos do cliente
        salvarClientesNoLocalStorage(); // Salva os clientes atualizados no Local Storage
    }
}


function atualizarPedidoNoCliente(venda) {
    const cliente = clientes.find(c => c.nome === venda.cliente);

    if (cliente) {
        const indexPedido = cliente.pedidos.findIndex(p => p.id === venda.id);
        if (indexPedido !== -1) {
            cliente.pedidos[indexPedido] = venda; // Atualiza o pedido no array
            salvarClientesNoLocalStorage();
        }
    }
}

function formatarData(data) {
    if (data === null) {
        return 'Não efetivado'; // Ou qualquer outro valor padrão que você queira exibir quando a data for nula
    }
    const dataObj = new Date(data); // Converte a string para um objeto Date
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = dataObj.getHours().toString().padStart(2, '0');
    const minutos = dataObj.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

function exibirNomeAdministrador() {
    const nomeAdministrador = localStorage.getItem('administrador');
    if (nomeAdministrador) {
        document.getElementById('nome-administrador').textContent = `Olá, ${nomeAdministrador}!`;
    }
}

function calcularValorInsumos(venda) {
    const valorVenda = venda.valorVenda;
    const valorFrete = venda.valorFrete;

    // Verifica se o frete foi informado
    if (typeof valorFrete === 'number') {
        return (valorVenda) * (1 / 5);
    } else {
        return null; // Retorna null se o cálculo não puder ser realizado
    }
}

function calcularComissaoProdutor(venda) {
    const valorVenda = venda.valorVenda;
    const valorFrete = venda.valorFrete;

    //Verifica se o frete já foi informado
    if(typeof valorFrete === 'number') {
        return (valorVenda - valorFrete) * (2 / 25);
    } else {
        return null;
    }
    
}

function calcularLucroVenda(venda) {
    const valorVenda = venda.valorVenda;
    const valorFrete = venda.valorFrete;
    const valorInsumos = calcularValorInsumos(venda);
    const comissaoProdutor = calcularComissaoProdutor(venda);
        //Verifica se o frete já foi informado
        if(typeof valorFrete === 'number') {
            return valorVenda - valorFrete - valorInsumos - comissaoProdutor;
        } else {
            return null;
        }
}
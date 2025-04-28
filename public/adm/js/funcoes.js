// funcoes.js

document.addEventListener('DOMContentLoaded', function() {
    exibirNomeAdministrador(); // Exibe o nome do administrador
    carregarHeader();
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

function fecharModalDetalhesPedido() {
    document.getElementById('modal-detalhes-pedido').style.display = 'none';

    // Limpa as informações do modal
    document.getElementById('modal-numero-pedido').textContent = '';
    document.getElementById('modal-cliente').textContent = '';
    document.getElementById('modal-vendedor').textContent = '';
    document.getElementById('modal-descricao').textContent = '';
    document.getElementById('modal-data-criacao').textContent = '';
    document.getElementById('modal-data-producao').textContent = '';
    document.getElementById('modal-data-finalizacao').textContent = '';
    document.getElementById('modal-valor-venda').textContent = '';
    document.getElementById('modal-valor-pago').textContent = '';
    document.getElementById('modal-valor-insumos').textContent = '';
    document.getElementById('modal-lucro-venda').textContent = '';
    document.getElementById('modal-status').textContent = '';
    document.getElementById('modal-saldoVenda').textContent = '';
    document.getElementById('modal-solicitado-por').textContent = '';
    document.getElementById('modal-produtor-span').textContent = '';
    document.getElementById('total-rape-pedido').textContent = '';

    // Limpa os inputs do modal
    document.getElementById('modal-produtor').value = '';
    document.querySelectorAll('#area-lote input').forEach(input => input.value = '');

    // Remove os event listeners dos botões "Cancelar Pedido"
    document.getElementById('btn-cancelar-pedido').removeEventListener('click', cancelarPedido);
    document.getElementById('btn-cancelar-pedido2').removeEventListener('click', cancelarPedido);
    document.getElementById('btn-cancelar-pedido3').removeEventListener('click', cancelarPedido);
    document.getElementById('btn-editar-pedido').removeEventListener('click', abrirModalEditarPedido);
    document.getElementById('btn-editar-pedido2').removeEventListener('click', abrirModalEditarPedido);
    document.getElementById('btn-editar-pedido3').removeEventListener('click', abrirModalEditarPedido);
    document.getElementById('btn-formatar-texto').removeEventListener('click', copiarParaAreaDeTransferencia);
    document.getElementById('btn-formatar-texto2').removeEventListener('click', copiarParaAreaDeTransferencia);

    pedido = null;
    // Recarrega a página
    window.location.reload();
}

function fecharModalDetalhesPedidoSite() {
    document.getElementById('modal-detalhes-pedido').style.display = 'none';

    // Limpa as informações do modal
    document.getElementById('modal-numero-pedido').textContent = '';
    document.getElementById('modal-cliente').textContent = '';
    document.getElementById('modal-vendedor').textContent = '';
    document.getElementById('modal-descricao').textContent = '';
    document.getElementById('modal-data-criacao').textContent = '';
    document.getElementById('modal-data-producao').textContent = '';
    document.getElementById('modal-data-finalizacao').textContent = '';
    document.getElementById('modal-valor-venda').textContent = '';
    document.getElementById('modal-valor-pago').textContent = '';
    document.getElementById('modal-valor-insumos').textContent = '';
    document.getElementById('modal-lucro-venda').textContent = '';
    document.getElementById('modal-status').textContent = '';
    document.getElementById('modal-saldoVenda').textContent = '';
    document.getElementById('modal-solicitado-por').textContent = '';
    document.getElementById('modal-produtor-span').textContent = '';
    document.getElementById('total-rape-pedido').textContent = '';

    // Limpa os inputs do modal
    document.getElementById('modal-produtor').value = '';
    document.querySelectorAll('#area-lote input').forEach(input => input.value = '');

    // Remove os event listeners dos botões "Cancelar Pedido"
    document.getElementById('btn-cancelar-pedido').removeEventListener('click', cancelarPedido);
    document.getElementById('btn-cancelar-pedido2').removeEventListener('click', cancelarPedido);
    document.getElementById('btn-cancelar-pedido3').removeEventListener('click', cancelarPedido);
    document.getElementById('btn-editar-pedido').removeEventListener('click', abrirModalEditarPedido);
    document.getElementById('btn-editar-pedido2').removeEventListener('click', abrirModalEditarPedido);
    document.getElementById('btn-editar-pedido3').removeEventListener('click', abrirModalEditarPedido);
    document.getElementById('btn-formatar-texto').removeEventListener('click', copiarParaAreaDeTransferencia);
    document.getElementById('btn-formatar-texto2').removeEventListener('click', copiarParaAreaDeTransferencia);

    pedido = null;
    // Recarrega a página
    window.location.reload();
}

function exibirDetalhesPedido(id) {
    let pedido; // Define a variável 'pedido' dentro do escopo da função
    // Exibe o modal
    document.getElementById('modal-detalhes-pedido').style.display = 'block';
    // Faz uma requisição GET para a API para obter os detalhes do pedido
    fetch(`/api/pedidos/${id}`, {
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
    .then(pedidoData => {
        pedido = pedidoData;
    //console.log(pedido);
    document.getElementById('modal-numero-pedido').textContent = `Detalhes do Pedido nº ${pedido.id}`;
    document.getElementById('modal-cliente').textContent = pedido.cliente;
    document.getElementById('modal-vendedor').textContent = pedido.vendedor;
    document.getElementById('modal-descricao').textContent = pedido.descricao;
    document.getElementById('modal-data-criacao').textContent = formatarData(pedido.data_criacao); //Data que o pedido foi criado
    document.getElementById('modal-data-producao').innerHTML = pedido.data_producao === null ? '<span class="span-vermelho">Não efetivada</span>' : formatarData(pedido.data_producao);
    document.getElementById('modal-data-finalizacao').innerHTML = pedido.data_finalizacao === null ? '<span class="span-vermelho">Não efetivada</span>' : formatarData(pedido.data_finalizacao);
    document.getElementById('modal-valor-venda').innerHTML = `<span class="span-laranja">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${parseFloat(pedido.valor_venda).toFixed(2)}</span>`;
    document.getElementById('modal-valor-pago').innerHTML = `<span class="span-verde">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${parseFloat(pedido.valor_pago).toFixed(2)}</span>`;
    document.getElementById('modal-valor-insumos').innerHTML = `<span class="span-vermelho">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${parseFloat(pedido.valor_insumos).toFixed(2)}</span>`;
    document.getElementById('modal-lucro-venda').innerHTML = `<span class="span-verde">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${parseFloat(pedido.lucro_venda).toFixed(2)}</span>`;
    document.getElementById('modal-status').textContent = pedido.status;
    document.getElementById('modal-saldoVenda').innerHTML = pedido.saldo_venda === "0.00" ? '<span class="span-verde">Pago</span>' : `<span class="span-vermelho">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${parseFloat(pedido.saldo_venda).toFixed(2)}</span>`;
    document.getElementById('modal-solicitado-por').textContent = pedido.administrador;
    document.getElementById('modal-produtor-span').textContent = `${pedido.produtor === undefined ? 'Ainda não produzido' : pedido.produtor}`;

    // Calcula a quantidade total de rapé no pedido
    let totalKg = 0;
    pedido.itens.forEach(item => {
        if (item.produto_id === 1) {
            totalKg += item.quantidade / 2;
        }
    });

    // Atualiza o texto do elemento total-rape-pedido
    document.getElementById('total-rape-pedido').textContent = `Quantidade total de rapé: ${totalKg.toFixed(1)}Kg (${totalKg * 2} ${totalKg * 2 === 1 ? 'Pacote)' : 'Pacotes)'}`;


        // Controle de exibição da área de lote
        const areaLote = document.getElementById('area-lote');
        if (pedido.status === 'Em produção') {
            areaLote.style.display = 'block';

            exibirProdutores('modal-produtor'); // Chama a função para popular o select de produtores[
            exibirInputsLote(pedido); // Chama a função para exibir os inputs de lote
    
            // Adiciona evento ao botão "Pronto, aguardando envio"
            const btnAtualizarStatus = document.getElementById('btn-atualizar-status');
            btnAtualizarStatus.onclick = () => {
                pedido.produtor = document.getElementById('modal-produtor').value;
                //console.log(pedido)
                atualizarStatusPedido(pedido);
                //salvarPedidosNoLocalStorage();
                //exibirPedidos();
                //fecharModalDetalhesPedido();
                //atualizarPedidoNoCliente(pedido); // Atualiza o pedido dentro da array do cliente
            };
        } else {
            areaLote.style.display = 'none';
        }

        function atualizarStatusPedido(pedido) {
            const lotes = {};
            let todosOsLotesPreenchidos = true;
        
            pedido.itens.forEach(item => {
                //console.log(item)
                if (item.produto_id === 1) { // Verifica se o item é rapé
                    const inputId = `lote-${item.tipo_rape.replace(/\s+/g, '')}`;
                    //console.log(inputId)
                    const lote = document.getElementById(inputId).value.trim();
                    if (lote === '') {
                        todosOsLotesPreenchidos = false;
                        return; // Sai do loop se algum lote estiver vazio
                    }
                    lotes[item.tipo_rape] = lote;
                }
            });
        
            // Verifica se um produtor foi selecionado
            let produtor = document.getElementById('modal-produtor').value;
            if (produtor === '') {
                alert('Por favor, selecione um produtor!');
                return;
            }
            //console.log(produtor)
            if (!todosOsLotesPreenchidos) {
                alert('Por favor, preencha todos os lotes!');
                return;
            }
            if (confirm(`Confirma a atualização do status do pedido nº ${pedido.id} para "Pronto, aguardando envio"?`)) {
                // Atualiza o pedido na API
                fetch(`/api/pedidos-aguardando-producao/${pedido.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        status: 'Pronto, aguardando envio',
                        dataProducao: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        produtor: produtor,
                        itens: pedido.itens.map(item => {
                            if (item.produto_id === 1) {
                                return {
                                    ...item,
                                    lote: document.getElementById(`lote-${item.tipo_rape.replace(/\s+/g, '')}`).value.trim()
                                };
                            }
                            return item;
                        })
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
                    location.reload();
                    return;
                })
                .catch(error => {
                    alert('Erro ao atualizar pedido.');
                    console.error(error);
                });
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
        if (item.produto === 'Rapé' && item.tipo_rape) {
            nomeProduto += ` (${item.tipo_rape})`;
            
            cellQuantidade.textContent = `${parseInt(item.quantidade).toFixed(0)} ${parseInt(item.quantidade) === 1 ? 'Pacote' : 'Pacotes'} - (${item.quantidade / 2}Kg)`;
        }

        cellProduto.textContent = nomeProduto;
        //cellQuantidade.textContent = parseFloat(item.quantidade).toFixed(1);
        cellLote.textContent = item.lote || 'Não informado'; // Exibe o lote se existir, caso contrário, exibe "-"
    });

    // Controle de exibição das áreas de frete e nota fiscal
    const areaFrete = document.getElementById('area-frete');
    const areaFinalizado = document.getElementById('area-finalizado');
    const areaNotaFiscal = document.getElementById('area-nota-fiscal');
    const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');
    const btnAdicionarNotaFiscal = document.getElementById('btn-adicionar-nota-fiscal');
    const btnConsultarNotaFiscal = document.getElementById('btn-consultar-nota-fiscal');

    if (pedido.status === 'Pronto, aguardando envio') {
        areaFinalizado.style.display = 'none';
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
    if (pedido.status === 'Finalizado') {
        areaFinalizado.style.display = 'block';
        //areaNotaFiscal.style.display = 'block';
        /*btnFinalizarPedido.onclick = () => {
            finalizarPedido(pedido);
        };*/
    } else {
        areaFinalizado.style.display = 'none';
    }
    adicionarEventListeners(pedido);

        // Preenche o valor do frete
        const valorFreteExibicao = document.getElementById('modal-valor-frete-exibicao');
        if (pedido.valor_frete) {
            valorFreteExibicao.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${parseFloat(pedido.valor_frete).toFixed(2)}`;
        } else {
            valorFreteExibicao.textContent = 'Não informado'; // Ou qualquer outro valor padrão se o frete não estiver definido
        }
    })
}

function exibirDetalhesPedidoSite(pedido) {
    // Exibe o modal
    document.getElementById('modal-detalhes-pedido-site').style.display = 'block';
    //console.log(pedido);

    document.getElementById('modal-numero-pedido-site').textContent = `Detalhes do Pedido nº ${pedido.id}`;
    document.getElementById('modal-cliente-site').textContent = pedido.cliente;
    document.getElementById('modal-vendedor-site').textContent = pedido.vendedor;
    document.getElementById('modal-cupom-site').textContent = pedido.cupom || 'Não possui';
    document.getElementById('modal-data-criacao-site').textContent = formatarData(pedido.data_criacao); //Data que o pedido foi criado
    document.getElementById('modal-data-producao-site').innerHTML = pedido.data_producao === null ? '<span class="span-vermelho">Não efetivada</span>' : formatarData(pedido.data_producao);
    document.getElementById('modal-data-finalizacao-site').innerHTML = pedido.data_finalizacao === null ? '<span class="span-vermelho">Não efetivada</span>' : formatarData(pedido.data_finalizacao);
    document.getElementById('modal-valor-venda-site').innerHTML = `<span class="span-laranja">${pedido.moeda === 'BRL' ? 'R$' : 'US$' } ${formatarValor(pedido.valor_venda)}</span>`;
    document.getElementById('modal-status-site').innerHTML = `${pedido.status === 'approved' || pedido.status === 'Pronto, aguardando envio' || pedido.status === 'Finalizado' ? '<span class="span-verde">Realizado' : '<span class="span-vermelho">Pendente'}</span>`;
    document.getElementById('modal-valor-insumos-site').innerHTML = `<span class="span-vermelho">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${formatarValor(pedido.valor_insumos)}</span>`;
    document.getElementById('modal-valor-frete-exibicao-site').innerHTML = `<span class="span-vermelho">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${formatarValor(pedido.valor_frete)}</span>`;
    document.getElementById('modal-lucro-venda-site').innerHTML = `<span class="span-verde">${pedido.moeda === 'real' ? 'R$' : 'US$' } ${formatarValor(pedido.lucro_venda)}</span>`;
    document.getElementById('modal-produtor-span-site').textContent = `${pedido.produtor === undefined ? 'Ainda não produzido' : pedido.produtor}`;

    // Faz uma requisição GET para a API para obter os itens do pedido
    fetch(`/api/pedidos/site/${pedido.id}`, {
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
    .then(itens => {
        //console.log(itens);
    if (pedido.produtor === undefined) {
        exibirProdutores('modal-produtor-site'); // Chama a função para popular o select de produtores
        const btnAtualizarStatus = document.getElementById('btn-atualizar-status-site');
        const areaLoteSite = document.getElementById('area-lote-site');
        areaLoteSite.style.display = 'block';
        btnAtualizarStatus.onclick = () => {
            pedido.produtor = document.getElementById('modal-produtor').value;
            //console.log(pedido)
            atualizarStatusPedidoSite(pedido);
        };
    }

    if (pedido.status === 'Pronto, aguardando envio') {
        const btnAtualizarStatus = document.getElementById('btn-atualizar-status-site2');
        const areaFreteSite = document.getElementById('area-frete-site');
        areaFreteSite.style.display = 'block';
        btnAtualizarStatus.onclick = () => {
            pedido.produtor = document.getElementById('modal-produtor').value;
            //console.log(pedido)
            finalizarPedidoSite(pedido);
        };
    }

    if (pedido.status === 'Finalizado') {
        const areaFinalizadoSite = document.getElementById('area-finalizado-site');
        areaFinalizadoSite.style.display = 'block';
    }

        function atualizarStatusPedidoSite(pedido) {
            console.log(pedido);
        
            // Verifica se um produtor foi selecionado
            let produtor = document.getElementById('modal-produtor-site').value;
            if (produtor === '') {
                alert('Por favor, selecione um produtor!');
                return;
            }
            
            if (confirm(`Confirma a atualização do status do pedido do ${pedido.cliente} para "Pronto, aguardando envio"?`)) {
                // Atualiza o pedido na API
                fetch(`/api/pedidos-aguardando-producao/site/${pedido.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        status: 'Pronto, aguardando envio',
                        dataProducao: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        produtor: produtor
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
                    location.reload();
                    return;
                })
                .catch(error => {
                    alert('Erro ao atualizar pedido.');
                    console.error(error);
                });
            }
        }

        // Exibe os itens do pedido na tabela
        const tbodyItens = document.getElementById('modal-tabela-itens-site').getElementsByTagName('tbody')[0];
        tbodyItens.innerHTML = ''; // Limpa a tabela
        itens.forEach(item => {
            const row = tbodyItens.insertRow();
            const cellProduto = row.insertCell();
            const cellQuantidade = row.insertCell();
            //const cellLote = row.insertCell();

            let nomeProduto = item.produto;
            cellProduto.textContent = nomeProduto;
            cellQuantidade.textContent = parseInt(item.quantidade).toFixed(0);
            //cellLote.textContent = item.lote || 'Não informado'; // Exibe o lote se existir, caso contrário, exibe "-"
        });

        //const btnFinalizarPedido = document.getElementById('btn-atualizar-status-site');
        const btnVerificarEndereco = document.getElementById('btn-endereco-pedido-site');
        btnVerificarEndereco.onclick = () => {
            abrirModalEnderecoPedidoSite( pedido.usuario_id,pedido.endereco_id);
        };
        const btnVerificarEndereco2 = document.getElementById('btn-endereco-pedido-site2');
        btnVerificarEndereco2.onclick = () => {
            abrirModalEnderecoPedidoSite( pedido.usuario_id,pedido.endereco_id);
        };
        const btnVerificarEndereco3 = document.getElementById('btn-endereco-pedido-site3');
        btnVerificarEndereco3.onclick = () => {
            abrirModalEnderecoPedidoSite( pedido.usuario_id,pedido.endereco_id);
        };
    
    })
}

function adicionarEventListeners(pedido) {

        // Adicione um event listener ao botão "Editar Pedido"
        document.getElementById('btn-editar-pedido').addEventListener('click', () =>
        {
            abrirModalEditarPedido(pedido);
        });
        // Adicione um event listener ao botão "Cancelar Pedido"
        document.getElementById('btn-cancelar-pedido').addEventListener('click', () =>
        {
            cancelarPedido(pedido);
        });

        // Adicione um event listener ao botão "Editar Pedido"
        document.getElementById('btn-editar-pedido2').addEventListener('click', () =>
        {
            abrirModalEditarPedido(pedido);
        });
        // Adicione um event listener ao botão "Cancelar Pedido"
        document.getElementById('btn-cancelar-pedido2').addEventListener('click', () =>
        {
            cancelarPedido(pedido);
        });

        // Adicione um event listener ao botão "Editar Pedido"
        document.getElementById('btn-editar-pedido3').addEventListener('click', () =>
        {
            abrirModalEditarPedido(pedido);
        });
        // Adicione um event listener ao botão "Cancelar Pedido"
        document.getElementById('btn-cancelar-pedido3').addEventListener('click', () =>
        {
            cancelarPedido(pedido);
        });
        // Adicione um event listener ao botão "Formatar Texto"
        document.getElementById('btn-formatar-texto').addEventListener('click', () => {
            if (pedido) {
                const textoFormatado = formatarTextoPedido(pedido);
                //console.log(textoFormatado)
                // Copia o texto para a área de transferência
                copiarParaAreaDeTransferencia(textoFormatado); // Chama a função auxiliar para copiar o texto
                alert('Texto formatado copiado para a área de transferência!');
            }
        });
        // Adicione um event listener ao botão "Formatar Texto"
        document.getElementById('btn-formatar-texto2').addEventListener('click', () => {
            if (pedido) {
                const textoFormatado = formatarTextoPedido(pedido);
                //console.log(textoFormatado)
                // Copia o texto para a área de transferência
                copiarParaAreaDeTransferencia(textoFormatado); // Chama a função auxiliar para copiar o texto
                alert('Texto formatado copiado para a área de transferência!');
            }
        });
}

/*function carregarPedidosDoLocalStorage() {
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
}*/

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
    return `${dia}/${mes}/${ano}`;
}

function exibirNomeAdministrador() {
    const nomeAdministrador = localStorage.getItem('administrador');
    if (nomeAdministrador === '1') {
        document.getElementById('nome-administrador').textContent = `Olá, Teteu!`;
    }
    if (nomeAdministrador === '2') {
        document.getElementById('nome-administrador').textContent = `Olá, Tetéia!`;
    }
    if (nomeAdministrador === '3') {
        document.getElementById('nome-administrador').textContent = `Olá, Rastael!`;
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

function carregarHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('cabecalho').innerHTML = html;

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

        // Remove o token do Local Storage
        localStorage.removeItem('token');

        // Remove o nome do administrador do Local Storage
        localStorage.removeItem('administradorNome');

        // Redireciona para a página de login
        window.location.href = '/'; // Ajuste o caminho para a página de login, se necessário

        alert('Logout feito com sucesso!');
    });
    document.getElementById('btn-logout-mobile').addEventListener('click', function() {
        // Remove a chave "administrador" do Local Storage
        localStorage.removeItem('administrador');

        // Remove o token do Local Storage
        localStorage.removeItem('token');

        // Remove o nome do administrador do Local Storage
        localStorage.removeItem('administradorNome');

        // Redireciona para a página de login
        window.location.href = '/'; // Ajuste o caminho para a página de login, se necessário

        alert('Logout feito com sucesso!');
    });
        });
}

function verificarAutenticacao() {
    const token = localStorage.getItem('token');

    // Verifica se estamos na página de login
    const isLoginPage = window.location.pathname === '/html/index.html' || window.location.pathname === '/';

    if (isLoginPage) {
        // Se estiver na página de login, exibe o conteúdo
        document.body.classList.add('visivel');
        return Promise.resolve(true); // Retorna uma promessa resolvida para evitar erros nas páginas protegidas
    }

    if (!token) {
        // Redireciona para a página de login se não houver token
        alert('Você deve fazer o Login primeiro');
        window.location.href = '/';
        return Promise.reject(false); // Retorna uma promessa rejeitada para evitar erros nas páginas protegidas
    }

    // Função para verificar a validade do token
    function verificarToken() {
        fetch('/api/verificar-token', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            if (!response.ok) {
                alert('Token de segurança vencido, faça o login novamente');
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar o token:', error);
        });
    }

    // Verifica a validade do token imediatamente
    verificarToken();

    // Verifica a validade do token a cada 100 segundos (100000 milissegundos)
    setInterval(verificarToken, 100000);

    // Adiciona a classe 'visivel' ao body para exibir o conteúdo
    document.body.classList.add('visivel');
    return Promise.resolve(true);
}

function popularSelectTiposRape(idInput) {
    const selectTipoRape = document.getElementById(idInput);
    selectTipoRape.innerHTML = '<option value="">Selecione o Tipo</option>'; // Limpa as opções existentes

    // Faz uma requisição à API para obter as variedades de rapé
    fetch('/api/estoque', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar variedades de rapé.');
        }
        return response.json();
    })
    .then(data => {
        const variedades = data.variedadesRape;
        // Ordena as variedades em ordem alfabética
        variedades.sort((a, b) => a.nome.localeCompare(b.nome));
        // Itera sobre as variedades e adiciona cada uma ao select
        variedades.forEach(variedade => {
            const option = document.createElement('option');
            option.value = variedade.nome;
            option.textContent = variedade.nome;
            selectTipoRape.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar variedades de rapé.');
        console.error(error);
    });
}

function exibirProdutores(inputId) {
    const listaProdutores = document.getElementById(inputId);
    listaProdutores.innerHTML = '<option value="">Selecione o Produtor</option>'; // Limpa as opções existentes

    // Faz uma requisição GET para a API para obter os funcionários
    fetch('/api/funcionarios/produtores', {
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
    .then(funcionarios => {
        // Itera sobre os funcionários e adiciona cada um à lista
        funcionarios.forEach(funcionario => {
            const listItem = document.createElement('option');
            listItem.textContent = funcionario.nome;
            listItem.value = funcionario.id;
            listItem.addEventListener('click', () => {
                exibirProducoesProdutor(funcionario);
            });
            listaProdutores.appendChild(listItem);
        });
    })
    .catch(error => {
        alert('Erro ao buscar funcionários.');
        console.error(error);
    });
}

async function converterDolarParaReal(valorDolar) {
    return fetch('/api/converter-dolar-real')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao consultar API de conversão.');
            }
            return response.json();
        })
        .then(data => {
            const cotacao = data.cotacao;
            const valorReal = valorDolar * cotacao;
            //console.log(valorReal)
            return valorReal;
        })
        .catch(error => {
            alert('Erro ao converter dólar para real.');
            console.error(error);
        });
}

async function converterRealParaDolar(valorReal) {
    return fetch('/api/converter-real-dolar')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao consultar API de conversão.');
            }
            return response.json();
        })
        .then(data => {
            const cotacao = data.cotacao;
            const valorDolar = valorReal * cotacao;
            //console.log(valorDolar)
            return valorDolar;
        })
        .catch(error => {
            alert('Erro ao converter dólar para real.');
            console.error(error);
        });
}

// Função para formatar valores para o padrão brasileiro
function formatarValor(valor) {
    valor = parseFloat(valor).toFixed(2); // Garante duas casas decimais
    const partes = valor.split('.');
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona ponto a cada três dígitos
    const decimal = partes[1];
    return inteiro + ',' + decimal; // Junta as partes com vírgula
  }

async function obterHoraServidor() {
    return fetch('/api/hora-servidor')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter a hora do servidor.');
            }
            return response.json();
        })
        .then(data => {
            return data.hora;
        })
        .catch(error => {
            console.error('Erro ao obter a hora do servidor:', error);
            return 'Erro ao obter a hora';
        });
}

function atualizarHoraServidor() {
    obterHoraServidor()
        .then(hora => {
            document.getElementById('hora-servidor').textContent = `Hora do Servidor: ${hora}`;
        });
}

function exibirUltimosRepassesFeitos(area) {
    const listaRepasses = document.getElementById(`lista-repasses-feitos-${area}`);
    listaRepasses.innerHTML = '';

    fetch(`/api/divisao-lucros/repasses-feitos-${area}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar últimos repasses feitos.');
        }
        return response.json();
    })
    .then(repasses => {
        //console.log(repasses)
        if (area === 'empresa') {
            repasses.forEach(repasse => {
                const listItem = document.createElement('li');
                listItem.textContent = `Do ${repasse.vendedor} para a empresa o valor de ${repasse.moeda === 'real' ? 'R$' : 'US$'} ${formatarValor(parseFloat(repasse.valor))} do Pedido nº ${repasse.pedido_id}, cadastrado pelo ${repasse.administrador} no dia ${formatarData(repasse.data)}.`;
                listaRepasses.appendChild(listItem);
            })
        } else {
            repasses.forEach(repasse => {
                const listItem = document.createElement('li');
                listItem.textContent = `Do ${repasse.vendedor} para ${area === 'producao' ? repasse.produtor : repasse.vendedor_destinatario} o valor de ${repasse.moeda === 'real' ? 'R$' : 'US$'} ${formatarValor(parseFloat(repasse.valor))}, cadastrado pelo ${repasse.administrador} no dia ${formatarData(repasse.data)}.`;
                //Adiciona uma classe de estilos para cada vendedor
                if (repasse.vendedor === 'Rafael') {
                    listItem.classList.add('azul');
                } else {
                    listItem.classList.add('verde');
                }
                listaRepasses.appendChild(listItem);
        })};
    })
    .catch(error => {
        alert('Erro ao buscar últimos repasses feitos.');
        console.error(error);
    });
}

// Validação usando expressão regular
function validarValor(valor) {
    const regex = /^[0-9]+(?:\.[0-9]+)?$/;
    return regex.test(valor);
}
//Como usar a função validarValor:
/*if (!validarValor(valorRepasse)) {
    alert('Por favor, insira um valor numérico válido.');
    return;
}*/

function cancelarPedido(pedido) {
    //console.log(pedido)
    if (confirm(`Tem certeza que deseja DELETAR o pedido nº ${pedido.id} do cliente ${pedido.cliente}? Todos os pagamentos que o ${pedido.cliente} fez relacionados a esse pedido também serão excluídos!`)) {
        const confirmacao = prompt(`Digite 'deletar' para confirmar a exclusão do pedido nº ${pedido.id} do cliente ${pedido.cliente}, se não está seguro disso contacte o Matheus!`);
        if (confirmacao === 'deletar') {
        // Faz uma requisição DELETE para a API para cancelar o pedido
        fetch(`/api/pedidos/${pedido.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cancelar pedido.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            location.reload();
            return;
        })
        .catch(error => {
            alert('Erro ao cancelar pedido.');
            console.error(error);
            return;
        });
    } else{
        alert('Exclusão cancelada');
        return;
    }}
    return;
}
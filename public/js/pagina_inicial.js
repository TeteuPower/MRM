document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    saudacoes();
    exibirPedidos();
    //atualizarHoraServidor();
    //setInterval(atualizarHoraServidor, 1000);
    const admId = parseInt(localStorage.getItem('administrador'));
    let paginaAtualPedidosFinalizados = 1;
    const pedidosPorPagina = 5; // Número de pedidos finalizados por página

    const pesquisaInput = document.getElementById('pesquisa-pedido');
    pesquisaInput.addEventListener('input', exibirPedidos);

    function exibirPedidos() {
        exibirPedidosAguardandoProducao();
        exibirPedidosFinalizadosAguardandoEnvio();
        exibirPedidosFinalizados();
    }

    function saudacoes() {
        obterHoraServidor()
        .then(hora => {
            const horaDia = new Date(hora.toLocaleString());
            const admNome = localStorage.getItem('administradorNome');
            if (0 <= horaDia.getHours() <= 4) {
                document.getElementById('saudacao-texto').textContent = `Boa noite ${admNome}!`;
            }
            if (5 <= horaDia.getHours() <= 11) {
                document.getElementById('saudacao-texto').textContent = `Bom dia ${admNome}!`;
            }
            if (12 <= horaDia.getHours() <= 17) {
                document.getElementById('saudacao-texto').textContent = `Boa tarde ${admNome}!`;
            }
            if (18 <= horaDia.getHours() <= 23) {
                document.getElementById('saudacao-texto').textContent = `Boa noite ${admNome}!`;
            }
        });
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
                //console.log(pedido)
                return (pedido.status === 'Em produção' && pedido.vendedor_id === admId) &&
                       (pedido.id.toString().includes(termoPesquisa) || 
                        pedido.cliente.toLowerCase().includes(termoPesquisa));
            });
    //console.log(pedidosFiltrados)
            // Ordena os pedidos por data de criação (mais recentes primeiro)
            pedidosFiltrados.sort((a, b) => b.dataCriacao - a.dataCriacao);
    
            // Itera sobre os pedidos filtrados e adiciona cada um à lista
            pedidosFiltrados.forEach(pedido => {
                //console.log(pedido)
                const listItem = document.createElement('li');
                listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${parseFloat(parseInt(pedido.quantidade_rape_pacotes)/2).toFixed(1)}Kg`;
    
                listItem.addEventListener('click', () => {
                    exibirDetalhesPedidoPaginaInicial(pedido.id);
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
                    return (pedido.status === 'Pronto, aguardando envio' && pedido.vendedor_id === admId) &&
                           (pedido.id.toString().includes(termoPesquisa) || 
                            pedido.cliente.toLowerCase().includes(termoPesquisa) ||
                            pedido.vendedor.toLowerCase().includes(termoPesquisa));
                });
        
                // Ordena os pedidos por data de criação (mais recentes primeiro)
                pedidosFiltrados.sort((a, b) => b.dataCriacao - a.dataCriacao);
        
                // Itera sobre os pedidos filtrados e adiciona cada um à lista
                pedidosFiltrados.forEach(pedido => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${parseFloat(parseInt(pedido.quantidade_rape_pacotes)/2).toFixed(1)}Kg`;
        
                    listItem.addEventListener('click', () => {
                        exibirDetalhesPedidoPaginaInicial(pedido.id);
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
            return (pedido.status === 'Finalizado' && pedido.vendedor_id === admId) &&
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
            listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${parseFloat(parseInt(pedido.quantidade_rape_pacotes)/2).toFixed(1)}Kg`;

            listItem.addEventListener('click', () => {
                exibirDetalhesPedidoPaginaInicial(pedido.id);
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

    function exibirDetalhesPedidoPaginaInicial(id) {
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
        .then(pedido => {
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
    
            // Preenche o valor do frete
            const valorFreteExibicao = document.getElementById('modal-valor-frete-exibicao');
            if (pedido.valor_frete) {
                valorFreteExibicao.textContent = `${pedido.moeda === 'real' ? 'R$' : 'US$' } ${parseFloat(pedido.valor_frete).toFixed(2)}`;
            } else {
                valorFreteExibicao.textContent = 'Não informado'; // Ou qualquer outro valor padrão se o frete não estiver definido
            }
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
        })
    
        // Exibe o modal
        document.getElementById('modal-detalhes-pedido').style.display = 'block';
    }
    
    function abrirModalEditarPedido(pedido) {
        fetch(`/api/pedidos/${pedido.id}`, {
          headers: {
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Erro ao buscar pedido. Verifique a conexão.');
            }
            return response.json();
          })
          .then((pedido) => {
            preencherModalEditarPedido(pedido); 
      
            document.getElementById('modal-editar-pedido').style.display = 'block';
          })
          .catch((error) => {
            alert('Erro ao buscar pedido. Detalhes no console.');
            console.error(error);
          });
          document.getElementById('salvar-alteracoes').addEventListener('click', () => {
            editarPedido(pedido); 
          });
    }
    
    function preencherModalEditarPedido(pedido) {
        popularProdutoresEditar();
        const dolar = `<option value="dolar">Dólar (US$)</option>`;
        const real = `<option value="real">Real (R$)</option>`;
        let moeda = '';
        if(pedido.moeda === 'dolar') {
            moeda = dolar
        }
        if(pedido.moeda === 'real'){
            moeda = real;
        }
    
        const pedidoElement = document.getElementById('editar-nome-pedido');
        const clienteElement = document.getElementById('editar-cliente');
        const vendedorElement = document.getElementById('editar-vendedor');
        const descricaoElement = document.getElementById('editar-descricao');
        const moedaElement = document.getElementById('editar-moeda');
        const valorVendaElement = document.getElementById('editar-valor-venda');
        const valorPagoElement = document.getElementById('editar-valor-pago');
        const statusElement = document.getElementById('editar-status');
        const valorFreteElement = document.getElementById('editar-valor-frete');
        const produtorElement = document.getElementById('editar-produtor');
        const saldoVendaElement = document.getElementById('editar-saldo-venda');
        const tbodyItens = document.getElementById('modal-tabela-editar-itens').getElementsByTagName('tbody')[0];
        const inputsLote = document.getElementById('inputs-lote');
    
        pedidoElement.textContent = `Editar Pedido Nº${pedido.id}`;
        pedidoElement.value = pedido.id;
        clienteElement.textContent = `Cliente: ${pedido.cliente}`;
        vendedorElement.textContent = pedido.vendedor;
        descricaoElement.value = pedido.descricao;
        moedaElement.innerHTML = moeda + dolar + real;
        valorVendaElement.value = pedido.valor_venda;
        valorPagoElement.value = pedido.valor_pago;
        statusElement.value = pedido.status;
        valorFreteElement.value = pedido.valor_frete;
        produtorElement.innerHTML = `<option value="${pedido.produtor_id}">${pedido.produtor}</option>`;
        //produtorElement.value = pedido.produtor;
        saldoVendaElement.value = calcularSaldoVenda(); 
        //console.log(pedido)
      
        // Função auxiliar para formatar a quantidade do item
        const formatarQuantidadeItem = (item) => {
          const quantidade = parseFloat(item.quantidade);
          const unidade = quantidade === 1 ? 'Pacote' : 'Pacotes';
          return `${quantidade.toFixed(0)} ${unidade} - (${(quantidade / 2).toFixed(1)}Kg)`;
        };
      
        // Popular tabela de itens
        tbodyItens.innerHTML = ''; // Limpar tabela
      
        pedido.itens.forEach((item, index) => {
          const row = tbodyItens.insertRow();
          const cellProduto = row.insertCell();
          const cellQuantidade = row.insertCell();
          const cellLote = row.insertCell();
          const cellAcoes = row.insertCell();
      
          cellProduto.textContent = item.produto === 'Rapé' && item.tipo_rape
            ? `Rapé (${item.tipo_rape})`
            : item.produto;
      
          cellQuantidade.textContent = formatarQuantidadeItem(item);
          cellLote.textContent = item.lote || 'Não informado';
      
          // Adicionar botão "Remover" à célula de ações
          const btnRemover = document.createElement('button');
          btnRemover.textContent = 'Remover';
          btnRemover.classList.add('btn-acao', 'vermelho');
          btnRemover.type = 'button';
          cellAcoes.appendChild(btnRemover);
          btnRemover.onclick = () => {
            removerItemDoCarrinho(pedido, index);
          };
        });
      
        // Preencher inputs de lote
        inputsLote.innerHTML = '';
        pedido.itens.forEach(item => {
          if (item.produtoId === '1') { 
            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');
      
            const label = document.createElement('label');
            label.textContent = `${item.tipo_rape} (${(item.quantidade / 2).toFixed(1)}Kg - ${parseInt(item.quantidade).toFixed(0)} ${parseInt(item.quantidade) === 1 ? 'Pacote' : 'Pacotes'})`;
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
      
        // Popular selects de clientes, vendedores e produtores (se necessário)
        // popularSelectClientesEditar();
        popularSelectVendedoresEditar(pedido);
      }
    
      function popularProdutoresEditar() {
        const selectProdutor = document.getElementById('editar-produtor');
        selectProdutor.innerHTML = '<option value="">Selecione o Produtor</option>';
    
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
    
    function calcularSaldoVenda() {
        const valorVenda = parseFloat(document.getElementById('editar-valor-venda').value) || 0;
        const valorPago = parseFloat(document.getElementById('editar-valor-pago').value) || 0;
        saldo = valorPago - valorVenda;
        document.getElementById('editar-saldo-venda').innerHTML = saldo === 0 ? '<span class="span-verde">Pago</span>' : `<span class="span-vermelho">${parseFloat(saldo).toFixed(2)}</span>`;
        //document.getElementById('editar-saldo-venda').textContent = `${saldo.toFixed(2)}`;
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
    

    


});

function fecharModalDetalhesPedido() {
    document.getElementById('modal-detalhes-pedido').style.display = 'none';
}

function fecharModalEditarPedido() {
    document.getElementById('modal-editar-pedido').style.display = 'none';
}
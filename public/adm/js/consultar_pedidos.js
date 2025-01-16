// consultar_pedidos.js - lógica da página consultar_pedidos.html

document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    //carregarClientesDoLocalStorage();
    //carregarPedidosDoLocalStorage();
    exibirPedidos();
    //carregarFuncionariosDoLocalStorage();

    //document.getElementById('moeda').addEventListener('change', calcularSaldoVenda);
    document.getElementById('btn-arquivar-pedido').addEventListener('click', function () {
        alert('Ainda não desenvolvido');
    });
    document.getElementById('editar-valor-venda').addEventListener('input', calcularSaldoVenda);
    document.getElementById('editar-valor-pago').addEventListener('input', calcularSaldoVenda);
    document.getElementById('produto').addEventListener('change', function () {
        const produtoSelecionado = this.value;
        if (produtoSelecionado === '1') {
            document.getElementById('opcoes-tipo-rape').style.display = 'block';
        } else {
            document.getElementById('opcoes-tipo-rape').style.display = 'none';
        }
    });
    document.getElementById('btn-adicionar-produto').addEventListener('click', function () {
        document.getElementById('modal-adicionar-produto').style.display = 'block';
        popularSelectTiposRape('tipo-rape');
        popularSelectProdutos();
    });

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
const pedidosPorPagina = 10; // Número de pedidos finalizados por página

function exibirPedidos() {
    exibirPedidosAguardandoProducao();
    exibirPedidosFinalizadosAguardandoEnvio();
    exibirPedidosFinalizados();
}

/*function exibirPedidosNaoFinalizados() {
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
}*/


function exibirInputsLote(pedido) {
    const inputsLote = document.getElementById('inputs-lote');
    inputsLote.innerHTML = ''; // Limpa os inputs existentes
    //console.log(pedido)

    pedido.itens.forEach(item => {
        if (item.produto === 'Rapé') {
            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            const label = document.createElement('label');
            //label.textContent = `${item.tipo_rape} (${item.quantidade / 2}Kg - ${item.quantidade} Pacotes):`;
            label.textContent = `${item.tipo_rape} (${item.quantidade / 2}Kg - ${parseInt(item.quantidade).toFixed(0)} ${parseInt(item.quantidade) === 1 ? 'Pacote' : 'Pacotes'})`;
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

async function finalizarPedido(pedido) {
    if (confirm(`Confirma a finalização do pedido nº ${pedido.id}?`)) {
        pedido.status = 'Finalizado';
        pedido.data_finalizacao = new Date().toISOString().slice(0, 19).replace('T', ' '), // Converte para o formato YYYY-MM-DD HH:MM:SS
        pedido.valor_frete = (pedido.moeda === 'dolar' ? await converterRealParaDolar(parseFloat(document.getElementById('modal-valor-frete').value)) || 0 : parseFloat(document.getElementById('modal-valor-frete').value) || 0);
        pedido.lucro_venda = pedido.lucro_venda - pedido.valor_frete;
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
                valorFrete: pedido.valor_frete,
                lucroVenda: pedido.lucro_venda
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
            location.reload();
        })
        .catch(error => {
            alert('Erro ao finalizar pedido.');
            console.error(error);
        });
        exibirPedidos();
        fecharModalDetalhesPedido();
    }
}

 let totalKg = 0;
 function somarTotalKg() {
    const totalKgElement = document.getElementById('total-pedidos-aguardando-producao');
    const totalKgElementPacotes = document.getElementById('total-pedidos-aguardando-producao-pacotes');
    totalKgElement.textContent = `Total a ser produzido: ${totalKg.toFixed(0)} Kg`;
    totalKgElementPacotes.textContent = `${(totalKg * 2).toFixed(0)} Pacotes`;
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
        totalKg = 0;
        // Filtra os pedidos com base no termo de pesquisa
        const pedidosFiltrados = pedidos.filter(pedido => {
            return (pedido.status === 'Em produção') &&
                   (pedido.id.toString().includes(termoPesquisa) || 
                    pedido.cliente_id.toLowerCase().includes(termoPesquisa) ||
                    pedido.vendedor_id.toLowerCase().includes(termoPesquisa));
        });
//console.log(pedidosFiltrados)
        // Ordena os pedidos por data de criação (mais recentes primeiro)
        pedidosFiltrados.sort((a, b) => b.id - a.id);

        // Itera sobre os pedidos filtrados e adiciona cada um à lista
        pedidosFiltrados.forEach(pedido => {
            //console.log(pedido)
            const listItem = document.createElement('li');
            listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${parseFloat(parseInt(pedido.quantidade_rape_pacotes)/2).toFixed(1)}Kg`;
            totalKg = totalKg + parseFloat(parseInt(pedido.quantidade_rape_pacotes)/2);

            listItem.addEventListener('click', () => {
                exibirDetalhesPedido(pedido.id);
            });

            listaPedidos.appendChild(listItem);
        });
        somarTotalKg();
        //console.log(totalKg)
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
            //pedidosFiltrados.sort((a, b) => b.dataCriacao - a.dataCriacao);
            pedidosFiltrados.sort((a, b) => new Date(b.data_producao) - new Date(a.data_producao)); // Ordena por data (mais recentes primeiro
    
            // Itera sobre os pedidos filtrados e adiciona cada um à lista
            pedidosFiltrados.forEach(pedido => {
                const listItem = document.createElement('li');
                listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${parseFloat(parseInt(pedido.quantidade_rape_pacotes)/2).toFixed(1)}Kg`;
    
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
        //console.log(pedido.data_finalizacao);
        return pedido.status === 'Finalizado' &&
        (pedido.id.toString().includes(termoPesquisa) || 
        pedido.cliente.toLowerCase().includes(termoPesquisa) ||
        pedido.vendedor.toLowerCase().includes(termoPesquisa)); // Adiciona pesquisa por vendedor
    }).sort((a, b) => new Date(b.data_finalizacao) - new Date(a.data_finalizacao)); // Ordena por data (mais recentes primeiro

    const inicio = (paginaAtualPedidosFinalizados - 1) * pedidosPorPagina;
    const fim = inicio + pedidosPorPagina;
    const pedidosPaginaAtual = pedidosFinalizados.slice(inicio, fim);

    pedidosPaginaAtual.forEach(pedido => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nº ${pedido.id} - ${pedido.cliente} - ${pedido.vendedor} - ${parseFloat(parseInt(pedido.quantidade_rape_pacotes)/2).toFixed(1)}Kg`;

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

// Função para preencher o modal de edição de pedido
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

function removerItemDoCarrinho(pedido, index) {
    //console.log(pedido);
  
    if (pedido && pedido.itens[index]) {
      const itemId = pedido.itens[index]; 
      //console.log(itemId);
  
      if (confirm(`Deseja excluir ${parseInt(itemId.quantidade).toFixed(0)} pacote(s) de ${itemId.tipo_rape === null ? itemId.produto : itemId.tipo_rape} do pedido?`)) {
        fetch(`/api/pedidos/itens/${itemId.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json' 
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao comunicar com o servidor.');
          }
          return response.json();
        })
        .then(data => {
        alert('Item removido com sucesso!');
        //console.log(data.message); // Exibe mensagem da API no console
        //preencherModalEditarPedido(pedido);
        // Remover a linha da tabela no front-end
        const tabelaItens = document.getElementById('modal-tabela-editar-itens').getElementsByTagName('tbody')[0];
        tabelaItens.deleteRow(index); 

        // Atualizar o objeto pedido no front-end (opcional, mas recomendado)
        pedido.itens.splice(index, 1); 
        exibirDetalhesPedido(pedido.id);
        })
        .catch(error => {
          alert('Erro ao remover item do pedido. Detalhes no console.');
          console.error(error);
        });
      }
    } else {
      console.error("Índice de item inválido ou pedido não encontrado.");
    }
  }

function calcularSaldoVenda() {
    const valorVenda = parseFloat(document.getElementById('editar-valor-venda').value) || 0;
    const valorPago = parseFloat(document.getElementById('editar-valor-pago').value) || 0;
    saldo = valorPago - valorVenda;
    document.getElementById('editar-saldo-venda').innerHTML = saldo === 0 ? '<span class="span-verde">Pago</span>' : `<span class="span-vermelho">${parseFloat(saldo).toFixed(2)}</span>`;
    //document.getElementById('editar-saldo-venda').textContent = `${saldo.toFixed(2)}`;
}

function fecharModalEditarPedido() {
    document.getElementById('modal-editar-pedido').style.display = 'none';
}

function editarPedido(pedido) {
//console.log(pedido)

    const vendedorElement = document.getElementById('editar-vendedor');
    const descricaoElement = document.getElementById('editar-descricao');
    const moedaElement = document.getElementById('editar-moeda');
    const valorVendaElement = document.getElementById('editar-valor-venda');
    const valorPagoElement = document.getElementById('editar-valor-pago');
    const statusElement = document.getElementById('editar-status');
    const valorFreteElement = document.getElementById('editar-valor-frete');
    const produtorElement = document.getElementById('editar-produtor');
    const saldoVendaElement = document.getElementById('editar-saldo-venda');


    pedido.vendedor_id = parseFloat(vendedorElement.value);
    pedido.descricao = descricaoElement.value;
    pedido.moeda = moedaElement.value;
    pedido.valor_venda = parseFloat(valorVendaElement.value);
    pedido.valor_pago = parseFloat(valorPagoElement.value);
    pedido.status = statusElement.value;
    pedido.valor_frete = parseFloat(valorFreteElement.value);
    pedido.produtor_id = parseFloat(produtorElement.value);
    pedido.saldo_venda = saldoVendaElement.textContent === 'Pago' ? 0 : parseInt(saldoVendaElement.textContent);
    pedido.lucro_venda = parseFloat(parseFloat(pedido.valor_venda) - parseFloat(pedido.valor_insumos));

//console.log(pedido);

    // Atualiza os lotes dos itens do pedido
    /*const inputsLote = document.querySelectorAll('#inputs-lote div.input-group');
    pedido.itens = pedido.itens.map(item => {
        if (item.produtoId === '1') {
            const inputLote = inputsLote.find(input => input.querySelector('label').textContent.includes(item.tipo_rape));
            if (inputLote) {
                item.lote = inputLote.querySelector('input').value;
            }
        }
        return item;
    });*/

  // Confirmação antes de atualizar
  if (confirm(`Deseja realmente alterar os dados do pedido ?`)) {
    // Atualiza o pedido na API
    fetch(`/api/pedidos/editar/${pedido.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(pedido)
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
        //fecharModalDetalhesPedido();
        exibirPedidos();
        return;
    })
    .catch(error => {
        alert('Erro ao atualizar pedido.');
        console.error(error);
        return;
    });
} return;
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

function adicionarAoCarrinhoEditar() {
    const produtoSelect = document.getElementById('produto');
    const pedidoElement = document.getElementById('editar-nome-pedido');
    const produto_id = parseFloat(produtoSelect.value); // Obtém o valor do select (ID do produto)
    const produto = produtoSelect.options[produtoSelect.selectedIndex].text;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    let tipo_rape = null;
    let lote = '';

    if (produto_id === 1) {
        tipo_rape = document.getElementById('tipo-rape').value;
        if (produto_id === '') {
            alert('Selecione um tipo de rapé!');
            return;
        }
    }

    const item = {
        pedido_id: pedidoElement.value,
        produto: produto,
        quantidade: quantidade,
        produto_id: produto_id,
        tipo_rape: tipo_rape,
        lote: lote
    };
    if(confirm(`Deseja adicionar ${quantidade} ${produto_id === 1 || produto_id === 3 ? 'Pacote(s)' : 'Un'} de ${produto_id === 1 ? tipo_rape : produto}`))
        // Envia os dados para a API
        fetch('/api/pedidos/adicionar-itens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(item)
        })        
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao registrar venda.');
            }
            return response.json();
        })
        .then(data => {
            alert('Produto adicionado com Sucesso!')
            // Obter o ID do pedido da resposta da API ou do item
            const pedidoId = item.pedido_id;
            const pedido = {
                id:pedidoId
            } 
            // Abrir o modal de edição com o ID do pedido correto
            //console.log(pedidoId)
            //abrirModalEditarPedido(pedido);
        })
        .catch(error => {
            alert('Erro ao registrar venda.');
            console.error(error);
        });
    //console.log(item);
    fecharModalAdicionarProduto();
}

function popularSelectProdutos() {
    const selectProduto = document.getElementById('produto');
    selectProduto.innerHTML = '<option value="">Selecione o Produto</option>'; // Limpa as opções existentes

    // Faz uma requisição à API para obter os produtos
    fetch('/api/estoque', {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos.');
        }
        return response.json();
    })
    .then(data => {
        const produtos = data.produtos;
        // Itera sobre os produtos e adiciona cada um ao select
        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.id; // Define o valor da opção como o ID do produto
            option.textContent = produto.nome;
            selectProduto.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar produtos.');
        console.error(error);
    });
}
function fecharModalAdicionarProduto() {
    document.getElementById('modal-adicionar-produto').style.display = 'none';
}

function formatarTextoPedido(pedido) {
    //console.log(pedido)
    let texto = `(${pedido.vendedor}) - (${pedido.cliente})\n`;
    texto += `Pedido: ${pedido.id}\n\n`;

    pedido.itens.forEach(item => {
        let nomeProduto = item.produto;
        if (item.produto === 'Rapé' && item.tipo_rape) {
            nomeProduto  = ` (${item.tipo_rape})`;
        }

        texto += `* ${item.lote || '-'} - ${nomeProduto}: (${item.quantidade / 2}Kg)\n`;
    });

    // Calcula o total de Kg de rapé
    const totalRapeKg = pedido.itens.reduce((total, item) => {
        if (item.produto === 'Rapé') {
            return total + (item.quantidade / 2);
        }
        return total;
    }, 0);

    texto += `\nTotal: ${totalRapeKg.toFixed(2)}Kg\n`;

    return texto;
}

function copiarParaAreaDeTransferencia(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
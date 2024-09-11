// consultar_pedidos.js - lógica da página consultar_pedidos.html

document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    //carregarClientesDoLocalStorage();
    //carregarPedidosDoLocalStorage();
    exibirPedidos();
    //carregarFuncionariosDoLocalStorage();

    //document.getElementById('moeda').addEventListener('change', calcularSaldoVenda);
    document.getElementById('editar-valor-venda').addEventListener('input', calcularSaldoVenda);
    document.getElementById('editar-valor-pago').addEventListener('input', calcularSaldoVenda);

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
        /*document.getElementById('salvar-alteracoes').addEventListener('click', () => {
          editarPedido(pedido); 
        });*/
      })
      .catch((error) => {
        alert('Erro ao buscar pedido. Detalhes no console.');
        console.error(error);
      });
  }

// Função para preencher o modal de edição de pedido
function preencherModalEditarPedido(pedido) {
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
  
    clienteElement.textContent = `Cliente: ${pedido.cliente}`;
    vendedorElement.textContent = pedido.vendedor;
    descricaoElement.value = pedido.descricao;
    moedaElement.innerHTML = `<option value="${pedido.moeda}">${pedido.moeda}</option>`;
    valorVendaElement.value = pedido.valor_venda;
    valorPagoElement.value = pedido.valor_pago;
    statusElement.value = pedido.status;
    valorFreteElement.value = pedido.valor_frete;
    produtorElement.value = pedido.produtor;
    saldoVendaElement.value = calcularSaldoVenda(); 
  
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
    // popularProdutoresEditar();
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

    document.getElementById('editar-saldo-venda').textContent = `${saldo.toFixed(2)}`;
}

function fecharModalEditarPedido() {
    document.getElementById('modal-editar-pedido').style.display = 'none';
}

function editarPedido(pedido) {
console.log(pedido)
  // Confirmação antes de atualizar
  if (!confirm(`Deseja realmente alterar os dados do pedido ?`)) {
    return; // Interrompe a função se o usuário cancelar
  }

    // Atualiza o pedido na API
    fetch(`/api/pedidos/${pedido.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            //cliente: document.getElementById('editar-cliente').value,
            //vendedor: document.getElementById('editar-vendedor').value,
            //descricao: document.getElementById('editar-descricao').value,
            //moeda: document.getElementById('editar-moeda').value,
            //valorVenda: parseFloat(document.getElementById('editar-valor-venda').value),
            //valorPago: parseFloat(document.getElementById('editar-valor-pago').value),
            //status: document.getElementById('editar-status').value,
            //valorFrete: parseFloat(document.getElementById('editar-valor-frete').value),
            //produtor: document.getElementById('editar-produtor').value,
            //saldoVenda: parseFloat(document.getElementById('editar-saldo-venda').value),
            /*itens: [
                // ... (lógica para obter os lotes dos itens) ...
            ]*/
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
        fecharModalEditarPedido();
        fecharModalDetalhesPedido();
        exibirPedidos();
    })
    .catch(error => {
        alert('Erro ao atualizar pedido.');
        console.error(error);
    });
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

    fetch('/api/produtores', {
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

function cancelarPedido(pedidoId) {
    if (confirm(`Tem certeza que deseja DELETAR o pedido nº ${pedidoId}?`)) {
        const confirmacao = prompt("Digite 'deletar' para confirmar a exclusão do pedido");
        if (confirmacao === 'deletar') {
        // Faz uma requisição DELETE para a API para cancelar o pedido
        fetch(`/api/pedidos/${pedidoId}`, {
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
            fecharModalDetalhesPedido();
            exibirPedidos(); // Atualiza a lista de pedidos
        })
        .catch(error => {
            alert('Erro ao cancelar pedido.');
            console.error(error);
        });
    } else{
        alert('Exclusão cancelada');
    }}
}

let carrinho = []; // Array para armazenar os itens do carrinho

document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    popularSelectProdutos();
    //carregarEstoqueDoLocalStorage();
    carregarClientesDoLocalStorage();
    carregarVendasDoLocalStorage();
    carregarFuncionariosDoLocalStorage();
    verificarDadosEPopularSelects();
    popularSelectTiposRape();
    exibirCarrinho();
    calcularTotalRape();

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
    });

    document.getElementById('moeda').addEventListener('change', calcularSaldoVenda);
    document.getElementById('valor-venda').addEventListener('input', calcularSaldoVenda);
    document.getElementById('valor-pago').addEventListener('input', calcularSaldoVenda);

    document.getElementById('form-nova-venda').addEventListener('submit',
    function (evento)
    {
        evento.preventDefault();

        if (carrinho.length === 0) {
            alert('O carrinho está vazio!');
            return;
        }

        const clienteSelecionado = document.getElementById('cliente').value;
        if (clienteSelecionado === '') {
            alert('Selecione um cliente!');
            return;
        }

        const vendedorSelecionado = document.getElementById('vendedor').value;
        if (vendedorSelecionado === '') {
            alert('Selecione um vendedor!');
            return;
        }

        const venda = {
            id: gerarIdVenda(),
            cliente: clienteSelecionado,
            vendedor: document.getElementById('vendedor').value,
            itens: carrinho,
            totalRape: calcularTotalRape(),
            moeda: document.getElementById('moeda').value,
            valorVenda: parseFloat(document.getElementById('valor-venda').value),
            valorPago: parseFloat(document.getElementById('valor-pago').value) || 0,
            saldoVenda: parseFloat(document.getElementById('valor-pago').value || '0') - parseFloat(document.getElementById('valor-venda').value),
            descricao: document.getElementById('descricao').value,
            dataCriacao: new Date(), // Adiciona a data e hora da criação
            status: 'Em produção', // Adiciona o status inicial
            dataProducao: null, // Data que o pedido foi produzido
            dataFinalizacao: null, // Data que o pedido foi finalizado
            vendaAdministrador: localStorage.getItem('administrador'), // Verifica se a venda foi cadastrada por um adm
            repasseComissao: false // Define repasseComissao como false
            
        };

        vendas.push(venda);
        salvarVendasNoLocalStorage();

        // Lógica para atualizar o estoque (deduzir os itens vendidos)
        atualizarEstoque(venda);
        // Atualiza o saldo do cliente
        atualizarSaldoCliente(venda);

        alert('Venda registrada com sucesso:', venda);

        // Limpa o formulário e o carrinho
        evento.target.reset();
        carrinho = [];
        exibirCarrinho();
        calcularTotalRape();
        calcularSaldoVenda();
    });
});

function verificarDadosEPopularSelects() {
    const selectCliente = document.getElementById('cliente');
    const selectVendedor = document.getElementById('vendedor');

    selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>';
    selectVendedor.innerHTML = '<option value="">Selecione o Vendedor</option>';

    // Faz requisições para as APIs para obter clientes e vendedores
    Promise.all([
        fetch('/api/clientes', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }),
        fetch('/api/funcionarios', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
    ])
    .then(responses => {
        return Promise.all(responses.map(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados.');
            }
            return response.json();
        }));
    })
    .then(data => {
        const clientes = data[0];
        const vendedores = data[1];

        // Verifica se há clientes e vendedores
        if (clientes.length === 0 || vendedores.length === 0) {
            let mensagem = 'Não há ';
            mensagem += clientes.length === 0 ? 'clientes' : '';
            mensagem += clientes.length === 0 && vendedores.length === 0 ? ' nem ' : '';
            mensagem += vendedores.length === 0 ? 'vendedores' : '';
            mensagem += ' cadastrados. Você será redirecionado para a página de ';
            mensagem += clientes.length === 0 ? 'cadastro de clientes.' : 'cadastro de funcionários.';

            alert(mensagem);
            window.location.href = clientes.length === 0 ? 'novo_cliente.html' : 'funcionarios.html';
            return;
        }

        // Popula os selects com os dados do banco de dados
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id; // Define o valor da opção como o ID do cliente
            option.textContent = cliente.nome;
            selectCliente.appendChild(option);
        });

        vendedores.forEach(vendedor => {
            const option = document.createElement('option');
            option.value = vendedor.id; // Define o valor da opção como o ID do vendedor
            option.textContent = vendedor.nome;
            selectVendedor.appendChild(option);
        });
    })
    .catch(error => {
        alert('Erro ao buscar dados.');
        console.error(error);
    });
}

function popularSelectTiposRape() {
    const selectTipoRape = document.getElementById('tipo-rape');
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

function fecharModalAdicionarProduto() {
    document.getElementById('modal-adicionar-produto').style.display = 'none';
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


function adicionarAoCarrinho() {
    const produtoSelect = document.getElementById('produto');
    const produtoId = parseFloat(produtoSelect.value); // Obtém o valor do select (ID do produto)
    const produto = produtoSelect.options[produtoSelect.selectedIndex].text;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    let tipoRape = null;

    if (produtoId === 1) {
        tipoRape = document.getElementById('tipo-rape').value;
        if (produtoId === '') {
            alert('Selecione um tipo de rapé!');
            return;
        }
    }

    const item = {
        produto: produto,
        quantidade: quantidade,
        produtoId: produtoId,
        tipoRape: tipoRape
    };

    carrinho.push(item);
    exibirCarrinho();
    calcularTotalRape();
    fecharModalAdicionarProduto();
}

function exibirCarrinho() {
    const tbodyCarrinho = document.getElementById('tabela-carrinho').getElementsByTagName('tbody')[0];
    tbodyCarrinho.innerHTML = '';

    carrinho.forEach((item, index) => {
        const row = tbodyCarrinho.insertRow();
        const cellProduto = row.insertCell();
        const cellQuantidade = row.insertCell();
        const cellAcoes = row.insertCell();

        let nomeProduto = item.produto;
        if (item.produtoId === 1 && item.tipoRape) {
            nomeProduto = `<span class="tipo-rape">(${item.tipoRape})</span>`;
        }

        cellProduto.innerHTML = nomeProduto; // Use innerHTML para renderizar o HTML
        if (item.produtoId === 1) {
            cellQuantidade.textContent = `${item.quantidade} ${item.quantidade === 1 ? 'Pacote' : 'Pacotes'}`;
        } else {
            cellQuantidade.textContent = `${item.quantidade} Un.`; // Exibe "Un." para outros produtos
        }

        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.classList.add('btn-acao', 'vermelho');
        btnRemover.onclick = () => {
            removerDoCarrinho(index);
        };
        cellAcoes.appendChild(btnRemover);
    });
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    exibirCarrinho();
    calcularTotalRape();
}

function calcularTotalRape() {
    let totalKg = 0;
    let totalPacotes = 0;

    carrinho.forEach(item => {
        if (item.produtoId === 1) {
            totalKg += item.quantidade / 2; // Cada pacote tem 500g (0.5kg)
            totalPacotes += item.quantidade;
        }
    });

    document.getElementById('total-rape').textContent = `${totalKg.toFixed(2)}Kg (${totalPacotes} Pacotes)`;
    return totalKg;
}

function calcularSaldoVenda() {
    const moeda = document.getElementById('moeda').value;
    const valorVenda = parseFloat(document.getElementById('valor-venda').value) || 0;
    const valorPago = parseFloat(document.getElementById('valor-pago').value) || 0;
    const saldo = valorPago - valorVenda;

    const simboloMoeda = moeda === 'real' ? 'R$' : 'US$';
    document.getElementById('saldo-venda').textContent = `${simboloMoeda} ${saldo.toFixed(2)}`;
}

function atualizarEstoque(venda) {
    venda.itens.forEach(item => {
        switch (item.produto) {
            case 'rape':
                estoque.rape.total -= item.quantidade / 2;
                estoque.rape.variedades[item.tipoRape] -= item.quantidade / 2;
                break;
            case 'couripes':
                estoque.couripes -= item.quantidade;
                break;
            case 'sananga':
                estoque.sananga -= item.quantidade;
                break;
            case 'artesanatos':
                estoque.artesanatos -= item.quantidade;
                break;
        }
    });

    salvarEstoqueNoLocalStorage(); // Função para salvar o estoque no Local Storage (você precisa criá-la)
}
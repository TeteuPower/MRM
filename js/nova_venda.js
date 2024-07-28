
let carrinho = []; // Array para armazenar os itens do carrinho

document.addEventListener('DOMContentLoaded', function () {
    carregarEstoqueDoLocalStorage();
    carregarClientesDoLocalStorage();
    carregarVendasDoLocalStorage();
    carregarFuncionariosDoLocalStorage();
    verificarDadosEPopularSelects()
    popularSelectTiposRape();
    exibirCarrinho();
    calcularTotalRape();

    document.getElementById('produto').addEventListener('change', function () {
        const produtoSelecionado = this.value;
        if (produtoSelecionado === 'rape') {
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

    document.getElementById('form-nova-venda').addEventListener('submit', function (evento) {
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
            vendaAdministrador: localStorage.getItem('administrador') // Verifica se a venda foi cadastrada por um adm
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

    selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>'; //Limpa as opções existentes
    selectVendedor.innerHTML = '<option value="">Selecione o Vendedor</option>'; //Limpa as opções existentes

    let temClientes = typeof clientes !== 'undefined' && clientes.length > 0; //Verifica se existem clientes cadastrados
    let temVendedores = typeof vendedores !== 'undefined' && vendedores.length > 0; //Verifica se existem vendedores cadastrados

    if (!temClientes || !temVendedores) {
        let mensagem = 'Não há ';
        mensagem += !temClientes ? 'clientes' : '';
        mensagem += !temClientes && !temVendedores ? ' nem ' : '';
        mensagem += !temVendedores ? 'vendedores' : '';
        mensagem += ' cadastrados. Você será redirecionado para a página de ';
        mensagem += !temClientes ? 'cadastro de clientes.' : 'cadastro de funcionários.';

        alert(mensagem);
        window.location.href = !temClientes ? 'novo_cliente.html' : 'funcionarios.html';
        return; // Encerra a função se não houver clientes ou vendedores
    }

    // Popula os selects se houver clientes e vendedores
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        selectCliente.appendChild(option);
    });

    vendedores.forEach(vendedor => {
        const option = document.createElement('option');
        option.value = vendedor;
        option.textContent = vendedor;
        selectVendedor.appendChild(option);
    });
}

function popularSelectTiposRape() {
    const selectTipoRape = document.getElementById('tipo-rape');
    tiposDeRape.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        selectTipoRape.appendChild(option);
    });
}

function fecharModalAdicionarProduto() {
    document.getElementById('modal-adicionar-produto').style.display = 'none';
}

function adicionarAoCarrinho() {
    const produto = document.getElementById('produto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    let tipoRape = null;

    if (produto === 'rape') {
        tipoRape = document.getElementById('tipo-rape').value;
        if (tipoRape === '') {
            alert('Selecione um tipo de rapé!');
            return;
        }
    }

    const item = {
        produto: produto,
        quantidade: quantidade,
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
        if (item.produto === 'rape' && item.tipoRape) {
            nomeProduto += ` (${item.tipoRape})`;
        }

        cellProduto.textContent = nomeProduto;
        cellQuantidade.textContent = item.quantidade;

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
        if (item.produto === 'rape') {
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
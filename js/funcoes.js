// Função para exibir mensagens na tela
function exibirMensagem(mensagem) {
    alert(mensagem);
}

// Função para validar email
function validarEmail(email) {
    // Expressão regular para validar email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
// Função para gerar um ID único
function gerarId() {
    return Math.floor(Math.random() * 10000);
}

// Função para adicionar um novo cliente
function adicionarCliente(nome, email, telefone, endereco, login, senha) {
    const novoCliente = {
        id: gerarId(),
        nome: nome,
        email: email,
        telefone: telefone,
        endereco: endereco,
        login: login,
        senha: senha,
        saldoReal: 0,
        saldoDolar: 0,
        historicoTransacoes: []
    };
    clientes.push(novoCliente);
    salvarDados();
    exibirMensagem("Cliente cadastrado com sucesso!");
}

// Função para adicionar um novo pedido
function adicionarPedido(cliente, vendedor, itens, valor, valorPago, descricao, solicitadoPor) {
    const novoPedido = {
        id: gerarId(),
        cliente: cliente,
        vendedor: vendedor,
        itens: itens,
        valor: valor,
        valorPago: valorPago,
        descricao: descricao,
        dataCriacao: new Date(),
        status: "Em produção",
        solicitadoPor: solicitadoPor
    };
    pedidos.push(novoPedido);
    salvarDados();
    atualizarEstoqueReservado(itens);
    exibirMensagem("Pedido adicionado com sucesso!");
}

// Função para atualizar o estoque reservado
function atualizarEstoqueReservado(itens) {
    itens.forEach(item => {
        if (item.produto === "Rapé") {
            estoque.produtos.rape.reservado += item.quantidade;
            estoque.produtos.rape.tipos[item.tipo] += item.quantidade;
        } else {
            estoque.produtos[item.produto.toLowerCase()].reservado += item.quantidade;
        }
    });
    salvarDados();
}

// Função para atualizar o status do pedido
function atualizarStatusPedido(id, novoStatus) {
    const pedido = pedidos.find(pedido => pedido.id === id);
    if (pedido) {
        pedido.status = novoStatus;
        salvarDados();
        exibirMensagem("Status do pedido atualizado com sucesso!");
    } else {
        exibirMensagem("Pedido não encontrado!");
    }
}
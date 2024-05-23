// Dados do estoque (simulado)
let estoque = {
    rape: {
        total: 100,
        tipos: {
            CHACRONA: 10,
            "JUREMA BRANCA": 5,
            SAMSARA: 15,
            ANGICO: 8,
            JATOBA: 12,
            CINNAMON: 5,
            NUTMEG: 7,
            "NUKINI JAGUAR": 10,
            "YAWANAWA FF": 8,
            BOBINSANA: 5,
            TSUNU: 3,
            MURICI: 2,
            CACAU: 5,
            CUMARU: 3,
            JUREMA: 2,
            VASHAWÁ: 5,
            "PAU PEREIRA(PARICÁ)": 8,
            MULATEIRO: 6,
            "RED TSUNU": 4,
            "CANELA DE VELHO": 7,
            "7 HIERBAS": 10,
            "PAU BRASIL": 12
        },
    },
    couripes: {
        quantidade: 100,
    },
    sananga: {
        quantidade: 50,
    },
    artesanatos: {
        quantidade: 250,
    },
    tabaco: {
        quantidade: 40,
    },
    cinzas: {
        total: 80,
        tipos: {
            CHACRONA: 10,
            "JUREMA BRANCA": 5,
            SAMSARA: 15,
            ANGICO: 8,
            JATOBA: 12,
            CINNAMON: 5,
            NUTMEG: 7,
            "NUKINI JAGUAR": 10
        },
    },
    pacotes: {
        quantidade: 120,
    },
    "adesivos-grandes": {
        quantidade: 90,
    },
};

// Dados dos clientes (simulado)
let clientes = [];

// Dados dos pedidos (simulado)
let pedidos = [];

// Variável para controlar o lucro total
let lucroTotal = 0;

// Função para carregar o conteúdo das páginas
function loadPage(pageName) {
    const pageContent = document.getElementById('page-content');
    switch (pageName) {
        case 'estoque':
            pageContent.innerHTML = `
                <h1>Estoque</h1>
                <div class="sections-container">
                  ${generateEstoqueSection()}
                  ${generateMateriasPrimasSection()}
                </div>
                ${generateAdministracaoSection()}
            `;
            updateEstoqueColors();
            break;
        case 'novo-cliente':
            pageContent.innerHTML = `
                <h1>Cadastro de Cliente</h1>
                ${generateNovoClienteForm()}
            `;
            break;
        case 'nova-venda':
            pageContent.innerHTML = `
                <h1>Nova Venda</h1>
                ${generateNovaVendaForm()}
            `;
            break;
        case 'consultar-pedidos':
            pageContent.innerHTML = `
                <h1>Consultar Pedidos</h1>
                ${generateConsultarPedidosSection()}
            `;
            break;
        case 'consultar-clientes':
            pageContent.innerHTML = `
                <h1>Consultar Clientes</h1>
                ${generateConsultarClientesSection()}
            `;
            break;
        default:
            pageContent.innerHTML = '<h1>Página não encontrada!</h1>';
    }

    // Adiciona event listeners após carregar o conteúdo da página
    addEventListenersToButtons();
}


// Funções para gerar as seções da página Estoque
function generateEstoqueSection() {
    return `
        <div class="section">
            <h2>Produtos Disponíveis</h2>
            <p id="rape-disponivel" style="font-size: 20px;">Rapé disponível: ${estoque.rape.total}Kg (${Math.floor(estoque.rape.total / 0.5)} Pacotes)</p>
            <button class="action-button" id="toggle-rape-detalhes">Exibir variedades</button>
            <div id="rape-detalhes" style="display: none;">
                ${Object.entries(estoque.rape.tipos)
                    .map(
                        ([tipo, quantidade]) =>
                            `<p>${tipo}: ${quantidade}Kg</p>`
                    )
                    .join('')}
            </div>
            <p id="couripes-disponivel">Couripes disponíveis: ${
                estoque.couripes.quantidade
            }</p>
            <p id="sananga-disponivel">Sananga disponível: ${
                estoque.sananga.quantidade
            }Kg (${Math.floor(
        estoque.sananga.quantidade / 0.5
    )} Pacotes)</p>
            <p id="artesanatos-disponivel">Artesanatos disponíveis: ${
                estoque.artesanatos.quantidade
            }</p>
        </div>
    `;
}


function generateMateriasPrimasSection() {
    return `
        <div class="section">
            <h2>Matérias-Primas</h2>
            <p id="tabaco-disponivel">Tabaco: ${
                estoque.tabaco.quantidade
            }Kg</p>
            <p id="cinzas-disponivel">Cinzas: ${
                estoque.cinzas.total
            }Kg <button class="action-button" id="toggle-cinzas-detalhes">Exibir variedades</button></p>
            <div id="cinzas-detalhes" style="display: none;">
                ${Object.entries(estoque.cinzas.tipos)
                    .map(
                        ([tipo, quantidade]) =>
                            `<p>${tipo}: ${quantidade}Kg</p>`
                    )
                    .join('')}
            </div>
            <p id="pacotes-disponivel">Pacotes: ${
                estoque.pacotes.quantidade
            }</p>
            <p id="adesivos-grandes-disponivel">Adesivos-Grandes: ${
                estoque['adesivos-grandes'].quantidade
            }</p>
        </div>
    `;
}

function generateAdministracaoSection() {
    return `
        <div class="section admin-section">
            <h2>Administração</h2>
            <div class="produtos">
                <h3>Produtos</h3>
                ${generateInputSection('Rapé', 'rape', 'Kg', generateSelectEstoque('rape'))}
                ${generateInputSection('Couripes', 'couripes')}
                ${generateInputSection('Sananga', 'sananga', 'Kg')}
                ${generateInputSection('Artesanatos', 'artesanatos')}
            </div>
            <div class="insumos">
                <h3>Insumos</h3>
                ${generateInputSection('Tabaco', 'tabaco', 'Kg')}
                ${generateInputSection(
                    'Cinzas',
                    'cinzas',
                    'Kg',
                    generateSelectEstoque('cinzas')
                )}
                ${generateInputSection('Pacotes', 'pacotes')}
                ${generateInputSection('Adesivos-Grandes', 'adesivos-grandes')}
            </div>
        </div>
    `;
}

// Funções auxiliares para gerar elementos HTML
function generateInputSection(
    label,
    estoqueKey,
    unit = '',
    extraInput = ''
) {
    return `
        <div class="input-section">
            <h4>${label}</h4>
            <input type="number" id="input-${estoqueKey}" placeholder="Quantidade em ${unit}">
            ${extraInput}
            <button class="action-button" data-action="adicionar" data-estoque="${estoqueKey}">Adicionar</button>
            <button class="action-button reduce" data-action="remover" data-estoque="${estoqueKey}">Reduzir</button>
        </div>
    `;
}

function generateSelectEstoque(tipo) {
    const options = Object.keys(estoque[tipo].tipos).map(
        (tipo) => `<option value="${tipo}">${tipo}</option>`
    );
    return `<select id="select-${tipo}-tipo">${options}</select>`;
}

// Funções para manipular o estoque
function adicionarAoEstoque(estoqueKey) {
    const inputValue = parseFloat(
        document.getElementById(`input-${estoqueKey}`).value
    );
    if (isNaN(inputValue) || inputValue <= 0) {
        alert('Insira uma quantidade válida!');
        return;
    }

    let mensagem = '';
    if (estoqueKey === 'cinzas' || estoqueKey === 'rape') {
        const selectedTipo = document.getElementById(`select-${estoqueKey}-tipo`).value;
        mensagem = `Deseja adicionar ${inputValue}kg de ${selectedTipo} ao estoque?`;
    } else {
        mensagem = `Deseja adicionar ${inputValue} ${
            estoqueKey === 'pacotes' || estoqueKey === 'adesivos-grandes'
                ? 'unidades'
                : 'Kg'
        } de ${estoqueKey} ao estoque?`;
    }

    confirmarAlteracao(mensagem, () => {
        if (estoqueKey === 'cinzas' || estoqueKey === 'rape') {
            const selectedTipo = document.getElementById(
                `select-${estoqueKey}-tipo`
            ).value;
            estoque[estoqueKey].tipos[selectedTipo] += inputValue;
            estoque[estoqueKey].total += inputValue;
        } else {
            estoque[estoqueKey].quantidade += inputValue;
        }
        atualizarEstoque();
        limparFormularioInput(`input-${estoqueKey}`);
    });
}


function removerDoEstoque(estoqueKey) {
    const inputValue = parseFloat(document.getElementById(`input-${estoqueKey}`).value);

    if (isNaN(inputValue) || inputValue <= 0) {
        alert('Insira uma quantidade válida!');
        return;
    }

    let mensagem = '';
    if (estoqueKey === 'cinzas' || estoqueKey === 'rape') {
        const selectedTipo = document.getElementById(`select-${estoqueKey}-tipo`).value;
        if (estoque[estoqueKey].tipos[selectedTipo] < inputValue) {
            alert('Quantidade insuficiente no estoque!');
            return;
        }
        mensagem = `Deseja remover ${inputValue}kg de ${selectedTipo} do estoque?`;
    } else {
        if (estoque[estoqueKey].quantidade < inputValue) {
            alert('Quantidade insuficiente no estoque!');
            return;
        }
        mensagem = `Deseja remover ${inputValue} ${
            estoqueKey === 'pacotes' || estoqueKey === 'adesivos-grandes'
                ? 'unidades'
                : 'Kg'
        } de ${estoqueKey} do estoque?`;
    }

    confirmarAlteracao(mensagem, () => {
        if (estoqueKey === 'cinzas' || estoqueKey === 'rape') {
            const selectedTipo = document.getElementById(`select-${estoqueKey}-tipo`).value;
            estoque[estoqueKey].tipos[selectedTipo] -= inputValue;
            estoque[estoqueKey].total -= inputValue;
        } else {
            estoque[estoqueKey].quantidade -= inputValue;
        }
        atualizarEstoque();
        limparFormularioInput(`input-${estoqueKey}`);
    });
}

function atualizarEstoque() {
    document.getElementById(
        'rape-disponivel'
    ).textContent = `Rapé disponível: ${estoque.rape.total}Kg (${Math.floor(
        estoque.rape.total / 0.5
    )} Pacotes)`;
    document.getElementById(
        'couripes-disponivel'
    ).textContent = `Couripes disponíveis: ${estoque.couripes.quantidade}`;
    document.getElementById(
        'sananga-disponivel'
    ).textContent = `Sananga disponível: ${
        estoque.sananga.quantidade
    }Kg (${Math.floor(estoque.sananga.quantidade / 0.5)} Pacotes)`;
    document.getElementById(
        'artesanatos-disponivel'
    ).textContent = `Artesanatos disponíveis: ${
        estoque.artesanatos.quantidade
    }`;
    document.getElementById(
        'tabaco-disponivel'
    ).textContent = `Tabaco: ${estoque.tabaco.quantidade}Kg`;
    document.getElementById(
        'cinzas-disponivel'
    ).textContent = `Cinzas: ${estoque.cinzas.total}Kg`;
    document.getElementById(
        'pacotes-disponivel'
    ).textContent = `Pacotes: ${estoque.pacotes.quantidade}`;
    document.getElementById(
        'adesivos-grandes-disponivel'
    ).textContent = `Adesivos-Grandes: ${
        estoque['adesivos-grandes'].quantidade
    }`;

    // Atualiza os detalhes dos tipos de cinza e rapé
    const detalhesCinzas = document.getElementById('cinzas-detalhes');
    detalhesCinzas.innerHTML = Object.entries(estoque.cinzas.tipos)
        .map(([tipo, quantidade]) => `<p>${tipo}: ${quantidade}Kg</p>`)
        .join('');

    const detalhesRape = document.getElementById('rape-detalhes');
    detalhesRape.innerHTML = Object.entries(estoque.rape.tipos)
        .map(([tipo, quantidade]) => `<p>${tipo}: ${quantidade}Kg</p>`)
        .join('');

    updateEstoqueColors();
}

// Função para atualizar as cores do estoque
function updateEstoqueColors() {
    updateEstoqueColor('rape', 50, 100);
    updateEstoqueColor('tabaco', 30, 60);
    updateEstoqueColor('cinzas', 50, 100);
    updateEstoqueColor('pacotes', 80, 150);
    updateEstoqueColor('adesivos-grandes', 80, 150);
}

// Função auxiliar para atualizar a cor de um item do estoque
function updateEstoqueColor(estoqueKey, limiteInferior, limiteSuperior) {
    const elementId = `${estoqueKey}-disponivel`;
    const quantidade =
        estoqueKey === 'cinzas' || estoqueKey === 'rape'
            ? estoque[estoqueKey].total
            : estoque[estoqueKey].quantidade;
    const element = document.getElementById(elementId);

    if (quantidade < limiteInferior) {
        element.style.color = 'red';
    } else if (quantidade >= limiteInferior && quantidade <= limiteSuperior) {
        element.style.color = 'yellow';
    } else {
        element.style.color = 'green';
    }
}


// Função para gerar o formulário de Novo Cliente
function generateNovoClienteForm() {
    return `
        <form id="novo-cliente-form">
            <input type="text" id="nome" placeholder="Nome" required>
            <input type="email" id="email" placeholder="E-mail" required>
            <input type="text" id="telefone" placeholder="Telefone" required>
            <input type="text" id="endereco" placeholder="Endereço" required>
            <div class="form-buttons">
              <button class="action-button" type="submit">Registrar</button>
              <button class="action-button reduce" type="reset">Limpar</button>
            </div>
        </form>
    `;
}

// Função para gerar o formulário de Nova Venda
function generateNovaVendaForm() {
    const clientesOptions = clientes
        .map(
            (cliente) =>
                `<option value="${cliente.id}">${cliente.nome}</option>`
        )
        .join('');
    return `
        <form id="nova-venda-form">
            <select id="cliente" required>
                <option value="">Selecione o cliente</option>
                ${clientesOptions}
            </select>
            <select id="vendedor" required>
                <option value="">Selecione o vendedor</option>
                <option value="Maithê">Maithê</option>
                <option value="Rafael">Rafael</option>
            </select>
            <textarea id="descricao" placeholder="Descrição/Comentários"></textarea>
            <div id="carrinho-produtos">
              </div>
            <div class="input-group">
                <label for="valor-venda">Valor da Venda:</label>
                <input type="number" id="valor-venda" required>
                <select id="moeda">
                    <option value="BRL">BRL</option>
                    <option value="USD">USD</option>
                </select>
            </div>
            <div class="input-group">
                <label for="valor-pago">Valor Pago:</label>
                <input type="number" id="valor-pago">
                <button class="action-button" type="button" onclick="adicionarProdutoAoCarrinho()">Adicionar Produto</button>
            </div>
            <button class="action-button" type="submit">Finalizar Venda</button>
        </form>
    `;
}

// Função para gerar a seção Consultar Pedidos
function generateConsultarPedidosSection() {
    let pedidosNaoFinalizados = pedidos.filter(
        (pedido) => pedido.status !== 'Finalizado'
    );
    let pedidosFinalizados = pedidos.filter(
        (pedido) => pedido.status === 'Finalizado'
    );

    let pedidosNaoFinalizadosHTML =
        pedidosNaoFinalizados.length > 0
            ? pedidosNaoFinalizados
                  .map((pedido) => {
                      return `
                        <div class="pedido">
                            <h3>Pedido #${pedido.id}</h3>
                            <p>Cliente: ${
                                clientes.find(
                                    (cliente) => cliente.id === pedido.clienteId
                                ).nome
                            }</p>
                            <p>Status: ${pedido.status}</p>
                            <button class="action-button" onclick="abrirDetalhesPedido(${pedido.id})">Ver Detalhes</button>
                        </div>
                    `;
                  })
                  .join('')
            : '<p>Nenhum pedido não finalizado.</p>';

    let pedidosFinalizadosHTML =
        pedidosFinalizados.length > 0
            ? pedidosFinalizados
                  .map((pedido) => {
                      return `
                        <div class="pedido">
                            <h3>Pedido #${pedido.id}</h3>
                            <p>Cliente: ${
                                clientes.find(
                                    (cliente) => cliente.id === pedido.clienteId
                                ).nome
                            }</p>
                            <p>Status: ${pedido.status}</p>
                            <button class="action-button" onclick="abrirDetalhesPedido(${pedido.id})">Ver Detalhes</button>
                        </div>
                    `;
                  })
                  .join('')
            : '<p>Nenhum pedido finalizado.</p>';

    return `
        <div class="section">
            <h2>Pedidos Não Finalizados</h2>
            ${pedidosNaoFinalizadosHTML}
        </div>
        <div class="section">
            <h2>Pedidos Finalizados</h2>
            ${pedidosFinalizadosHTML}
        </div>
    `;
}

// Função para gerar a seção Consultar Clientes
function generateConsultarClientesSection() {
    const clientesHTML = clientes
        .map((cliente) => {
            return `
                <div class="cliente">
                    <h3>${cliente.nome}</h3>
                    <p>Saldo: ${cliente.saldo}</p>
                    <button class="action-button" onclick="abrirDetalhesCliente(${
                        cliente.id
                    })">Ver Detalhes</button>
                </div>
            `;
        })
        .join('');
    return `<div id="clientes-list">${clientesHTML}</div>`;
}

// Funções para manipular clientes
function adicionarCliente(event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    const novoCliente = {
        id: Date.now(), // Gera um ID único (temporário)
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        saldo: 0,
        transacoes: [],
        pedidos: [],
    };

    clientes.push(novoCliente);
    limparFormulario('novo-cliente-form');
    alert('Cliente cadastrado com sucesso!');
}

// Funções para manipular vendas
let carrinho = [];

function adicionarProdutoAoCarrinho() {
    let produto = prompt(
        'Qual produto deseja adicionar? (Rapé, Couripes, Sananga, Artesanatos)'
    );
    let quantidade = 0;

    if (produto) {
        produto = produto.toLowerCase();

        if (
            produto !== 'rapé' &&
            produto !== 'couripes' &&
            produto !== 'sananga' &&
            produto !== 'artesanatos'
        ) {
            alert('Produto inválido!');
            return;
        }

        quantidade = parseInt(prompt(`Digite a quantidade de ${produto}:`));
        if (isNaN(quantidade) || quantidade <= 0) {
            alert('Quantidade inválida!');
            return;
        }

        if (produto === 'rapé') {
            let tipoRapé = prompt(
                'Digite o tipo de rapé (ou cancelar para voltar):'
            );
            if (tipoRapé) {
                tipoRapé = tipoRapé.toUpperCase();
                if (!estoque.rape.tipos[tipoRapé]) {
                    alert('Tipo de rapé inválido!');
                    return;
                }
                carrinho.push({
                    produto: 'rapé',
                    tipo: tipoRapé,
                    quantidade: quantidade,
                });
            } else {
                return; // O usuário cancelou a adição do rapé
            }
        } else {
            carrinho.push({ produto: produto, quantidade: quantidade });
        }

        atualizarCarrinho();
    }
}

function atualizarCarrinho() {
    const carrinhoProdutosDiv = document.getElementById('carrinho-produtos');
    carrinhoProdutosDiv.innerHTML = '';

    if (carrinho.length === 0) {
        carrinhoProdutosDiv.innerHTML = '<p>Carrinho vazio.</p>';
        return;
    }

    carrinhoProdutosDiv.innerHTML = `
        <h3>Carrinho de Compras</h3>
        <ul>
            ${carrinho
                .map(
                    (item) => `
                <li>
                    ${item.produto.toUpperCase()} - ${
                        item.tipo ? `${item.tipo} - ` : ''
                    } ${item.quantidade} ${
                        item.tipo ? 'pacotes' : 'unidade(s)'
                    }
                    <button class="action-button reduce" onclick="removerDoCarrinho('${
                        item.produto
                    }'${
                        item.tipo ? `, '${item.tipo}'` : ''
                    })">Remover</button>
                </li>
            `
                )
                .join('')}
        </ul>
    `;
}

function removerDoCarrinho(produto, tipo = null) {
    if (tipo) {
        carrinho = carrinho.filter(
            (item) => !(item.produto === produto && item.tipo === tipo)
        );
    } else {
        carrinho = carrinho.filter((item) => item.produto !== produto);
    }
    atualizarCarrinho();
}

function registrarVenda(event) {
    event.preventDefault();

    const clienteId = parseInt(document.getElementById('cliente').value);
    const vendedor = document.getElementById('vendedor').value;
    const descricao = document.getElementById('descricao').value;
    const valorVenda = parseFloat(
        document.getElementById('valor-venda').value
    );
    const valorPago = parseFloat(document.getElementById('valor-pago').value) || 0;
    const moeda = document.getElementById('moeda').value;

    if (carrinho.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }

    const cliente = clientes.find((c) => c.id === clienteId);
    if (!cliente) {
        alert('Cliente não encontrado!');
        return;
    }

    confirmarAlteracao(
        'Tem certeza que deseja finalizar a venda?',
        () => {
            const novoPedido = {
                id: Date.now(),
                clienteId: clienteId,
                vendedor: vendedor,
                descricao: descricao,
                valor: valorVenda,
                valorPago: valorPago,
                moeda: moeda,
                status: 'Em produção',
                itens: carrinho,
                dataCriacao: new Date(),
                lucro: valorVenda - calcularCustoProdutos(carrinho), // Calcula o lucro inicial
            };

            pedidos.push(novoPedido);
            cliente.saldo += valorPago - valorVenda;
            cliente.transacoes.push({
                tipo: 'venda',
                valor: valorVenda,
                data: new Date(),
            });
            lucroTotal += novoPedido.lucro; // Adiciona o lucro do pedido ao lucro total

            // Limpa os dados da venda
            carrinho = [];
            atualizarCarrinho();
            limparFormulario('nova-venda-form');
            atualizarClientes();
            atualizarLucroTotal();
            alert('Venda registrada com sucesso!');
        }
    );
}

// Função para calcular o custo total dos produtos no carrinho
function calcularCustoProdutos(carrinho) {
    let custoTotal = 0;
    carrinho.forEach((item) => {
        switch (item.produto) {
            case 'rapé':
                custoTotal +=
                    (item.quantidade * 0.5 *
                        estoque.rape.tipos[item.tipo]) /
                    1000; // Calcula o custo do rapé com base no tipo e quantidade
                break;
            case 'couripes':
                custoTotal += item.quantidade * 0.05; // Substitua 0.05 pelo custo unitário do Couripe
                break;
            case 'sananga':
                custoTotal += item.quantidade * 0.5 * 0.1; // Substitua 0.1 pelo custo por Kg da Sananga
                break;
            case 'artesanatos':
                custoTotal += item.quantidade * 0.2; // Substitua 0.2 pelo custo unitário do Artesanato
                break;
        }
    });
    return custoTotal;
}

// Funções para manipular pedidos
function abrirDetalhesPedido(pedidoId) {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) {
        alert('Pedido não encontrado!');
        return;
    }
    const cliente = clientes.find((c) => c.id === pedido.clienteId);

    let detalhesPedidoHTML = `
        <h3>Detalhes do Pedido #${pedido.id}</h3>
        <p><strong>Cliente:</strong> ${cliente.nome}</p>
        <p><strong>Vendedor:</strong> ${pedido.vendedor}</p>
        <p><strong>Descrição/Comentários:</strong> ${pedido.descricao}</p>
        <p><strong>Data de Criação:</strong> ${pedido.dataCriacao.toLocaleDateString()}</p>
        <p><strong>Valor da Venda:</strong> ${pedido.valor} ${pedido.moeda}</p>
        <p><strong>Valor Pago:</strong> ${pedido.valorPago} ${pedido.moeda}</p>
        <p><strong>Status:</strong> ${pedido.status}</p>
        <h4>Itens do Pedido:</h4>
        <ul>
            ${pedido.itens
                .map(
                    (item) => `
                <li>${item.produto.toUpperCase()} - ${
                        item.tipo ? `${item.tipo} - ` : ''
                    } ${item.quantidade} ${
                        item.tipo ? 'pacotes' : 'unidade(s)'
                    }</li>
            `
                )
                .join('')}
        </ul>
        <p><strong>Lucro da Venda:</strong> ${pedido.lucro.toFixed(2)} ${
        pedido.moeda
    }</p>
    `;

    if (pedido.status === 'Finalizado') {
        detalhesPedidoHTML += `<p><strong>Frete:</strong> ${pedido.frete ? pedido.frete.toFixed(2) + ' ' + pedido.moeda : 'Não Informado'}</p>`; // Exibe o frete se o pedido estiver finalizado
    } else {
        detalhesPedidoHTML += `
            <div class="input-group">
                <label for="frete-pedido-${pedido.id}">Frete:</label>
                <input type="number" id="frete-pedido-${pedido.id}">
                <button class="action-button" onclick="finalizarPedido(${pedido.id})">Finalizar Pedido</button>
            </div>
        `;
    }

    mostrarModal('Detalhes do Pedido', detalhesPedidoHTML);
}

function finalizarPedido(pedidoId) {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    const frete = parseFloat(
        document.getElementById(`frete-pedido-${pedidoId}`).value
    );
    if (isNaN(frete) || frete < 0) {
        alert('Insira um valor de frete válido!');
        return;
    }

    confirmarAlteracao(
        `Confirmar finalização do pedido #${pedidoId}? O frete será de ${frete.toFixed(2)} ${pedido.moeda}.`,
        () => {
            pedido.status = 'Finalizado';
            pedido.frete = frete;
            pedido.lucro -= frete; // Subtrai o frete do lucro
            lucroTotal -= frete; // Atualiza o lucro total
            atualizarLucroTotal();
            fecharModal();
            loadPage('consultar-pedidos'); // Recarrega a página de pedidos
        }
    );
}

// Funções para manipular clientes
function abrirDetalhesCliente(clienteId) {
    const cliente = clientes.find((c) => c.id === clienteId);
    if (!cliente) {
        alert('Cliente não encontrado!');
        return;
    }

    const transacoesHTML = cliente.transacoes
        .map(
            (transacao) => `
        <li>${transacao.tipo}: ${transacao.valor} ${
                cliente.moeda
            } - ${transacao.data.toLocaleDateString()}</li>
    `
        )
        .join('');

    const pedidosHTML = cliente.pedidos
        .map(
            (pedidoId) => `
        <li>
            Pedido #${pedidoId} - ${
                pedidos.find((p) => p.id === pedidoId).status
            } - 
            <button class="action-button" onclick="abrirDetalhesPedido(${pedidoId})">Ver Detalhes</button>
        </li>
    `
        )
        .join('');

    const detalhesClienteHTML = `
        <h3>Detalhes do Cliente: ${cliente.nome}</h3>
        <p><strong>E-mail:</strong> ${cliente.email}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <p><strong>Endereço:</strong> ${cliente.endereco}</p>
        <p><strong>Saldo:</strong> ${cliente.saldo.toFixed(2)} ${
        cliente.moeda
    }</p>
        <h4>Histórico de Transações:</h4>
        <ul>${transacoesHTML}</ul>
        <h4>Histórico de Pedidos:</h4>
        <ul>${pedidosHTML}</ul>
    `;

    mostrarModal('Detalhes do Cliente', detalhesClienteHTML);
}

// Funções auxiliares
function limparFormulario(formId) {
    document.getElementById(formId).reset();
}

function limparFormularioInput(inputId) {
    document.getElementById(inputId).value = '';
}

function atualizarClientes() {
    const clientesList = document.getElementById('clientes-list');
    clientesList.innerHTML = generateConsultarClientesSection();
}

function atualizarLucroTotal() {
    // (Implemente a lógica para exibir o lucro total na página de Finanças)
}

// Funções para o Modal de Confirmação
function confirmarAlteracao(mensagem, callback) {
    const modal = document.getElementById('modal-confirmacao');
    const modalMensagem = document.getElementById('modal-mensagem');
    const confirmarAcao = document.getElementById('confirmar-acao');
    const cancelarAcao = document.getElementById('cancelar-acao'); // Adicione esta linha

    modalMensagem.textContent = mensagem;
    modal.style.display = 'block';

    confirmarAcao.onclick = () => {
        callback();
        fecharModal();
    };

    cancelarAcao.onclick = () => {
        fecharModal();
    };
}

function mostrarModal(titulo, conteudo) {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-mensagem').innerHTML = conteudo; // Permite HTML no conteúdo
    document.getElementById('modal-confirmacao').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-confirmacao').style.display = 'none';
}

// Event listeners para os formulários
document
    .getElementById('page-content')
    .addEventListener('submit', (event) => {
        if (event.target.id === 'novo-cliente-form') {
            adicionarCliente(event);
        } else if (event.target.id === 'nova-venda-form') {
            registrarVenda(event);
        }
    });

// Event listener para o botão de detalhes das cinzas e rapé
document.getElementById('page-content').addEventListener('click', (event) => {
    if (event.target.id === 'toggle-cinzas-detalhes') {
        const detalhesCinzas = document.getElementById('cinzas-detalhes');
        detalhesCinzas.style.display =
            detalhesCinzas.style.display === 'none' ? 'block' : 'none';
    } else if (event.target.id === 'toggle-rape-detalhes') {
        const detalhesRape = document.getElementById('rape-detalhes');
        detalhesRape.style.display =
            detalhesRape.style.display === 'none' ? 'block' : 'none';
    }
});

// Função para adicionar Event Listeners aos botões (corrigida)
function addEventListenersToButtons() {
    const buttons = document.querySelectorAll('.action-button');
    buttons.forEach((button) => {
        // Verifica se o evento já foi adicionado para evitar duplicação
        if (!button.dataset.listenerAdicionado) {
            button.addEventListener('click', (event) => {
                const action = button.getAttribute('data-action'); // Corrigido: usa getAttribute
                const estoqueKey = button.getAttribute('data-estoque'); // Corrigido: usa getAttribute

                if (action && estoqueKey) {
                    if (action === 'adicionar') {
                        adicionarAoEstoque(estoqueKey);
                    } else if (action === 'remover') {
                        removerDoEstoque(estoqueKey);
                    }
                }
            });

            // Marca o botão como tendo o listener adicionado
            button.dataset.listenerAdicionado = true;
        }
    });
}


// Carrega a página inicial
loadPage('estoque');

// Adiciona event listeners aos botões de navegação
const pageButtons = document.querySelectorAll('.page-button');
pageButtons.forEach((button) => {
button.addEventListener('click', () => {
const pageName = button.getAttribute('data-page');
loadPage(pageName);
});
});
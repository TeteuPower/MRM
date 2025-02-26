document.addEventListener("DOMContentLoaded", function () {
    verificarAutenticacao();
    carregarProdutos();
});

function carregarProdutos() {
    fetch('/api/produtos-site', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        const tbody = document.querySelector('#tabela-vendas-vendedor-simples tbody');
        tbody.innerHTML = ''; // Limpa a tabela antes de adicionar os produtos

        data.produtos.forEach(produto => {
            const produtoFoto = produto.img_url;
            if (produtoFoto === null) {
                produto.img_url = 'https://firebasestorage.googleapis.com/v0/b/ecommerceteste-adeaa.firebasestorage.app/o/img_rape.webp?alt=media&token=5d601f96-27ee-49d6-8a48-6609937e431e';
            }
            const row = document.createElement('tr');
            row.setAttribute('data-produto-id', produto.id); // Adiciona o ID do produto
            row.innerHTML = `
            <td><img src="${produto.img_url}" alt="${produto.nome}" style="width: auto; height: 50px;"></td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco}</td>
            <td>${produto.quantidade}</td> 
            <td>${produto.status}</td>
            <td>${produto.categoria}</td>
            <td>${produto.descricao}</td>
            `;

            // Adiciona o evento de clique:
            row.addEventListener('click', () => {
                abrirModalEdicao(produto);
            });

            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));
}

function abrirModalEdicao(produto) {
  
    if (!produto) {
      console.error('Produto não encontrado:', produto);
      return;
    }

    // 1. Limpar os valores dos campos do modal (exemplo básico):
    document.getElementById('modal-titulo').textContent = '';
    document.getElementById('modal-preco').value = '';
    document.getElementById('modal-quantidade').value = '';
    document.getElementById('modal-status').value = '';
    document.getElementById('modal-categoria').value = '';
    document.getElementById('modal-descricao').value = '';
    document.getElementById('modal-imagem').value = '';
    // Limpar o data-produto-id (antes de definir um novo):
    document.getElementById('modal-edicao').removeAttribute('data-produto-id');

    //console.log(produto);
  
    // 2. Preencher o modal
    document.getElementById('modal-titulo').value = produto.nome;
    document.getElementById('modal-preco').value = produto.preco;
    document.getElementById('modal-quantidade').value = produto.quantidade;
    document.getElementById('modal-status').value = produto.status;
    document.getElementById('modal-categoria').value = produto.categoria;
    document.getElementById('modal-descricao').value = produto.descricao;
    document.getElementById('modal-imagem').value = produto.img_url;

    // 3. Adicionar o ID do produto ao modal:
    document.getElementById('modal-edicao').setAttribute('data-produto-id', produto.id);
  
    // 4. Exibir o modal
    document.getElementById('modal-edicao').style.display = 'block';
}

function salvarAlteracoes() {
    const produtoId = document.getElementById('modal-edicao').getAttribute('data-produto-id');
    console.log(produtoId);
    const titulo = document.getElementById('modal-titulo').value;
    const preco = document.getElementById('modal-preco').value;
    const quantidade = document.getElementById('modal-quantidade').value;    
    const status = document.getElementById('modal-status').value;
    const categoria = document.getElementById('modal-categoria').value;
    const descricao = document.getElementById('modal-descricao').value;
    const imagem = document.getElementById('modal-imagem').value;

    fetch(`/api/produtos-site/${produtoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            nome: titulo,
            preco: preco,
            quantidade: quantidade,
            status: status,
            categoria: categoria,
            descricao: descricao,
            img_url: imagem
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('modal-edicao').style.display = 'none';
        carregarProdutos(); // Atualiza a tabela de produtos
    })
    .catch(error => console.error('Erro ao salvar alterações:', error));
}

function fecharModal() {
    // Fechar o modal:
      document.getElementById('modal-edicao').style.display = 'none';
    // Limpar o data-produto-id:
    document.getElementById('modal-edicao').removeAttribute('data-produto-id');
}
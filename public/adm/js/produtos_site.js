document.addEventListener("DOMContentLoaded", function () {
    verificarAutenticacao();
    carregarProdutos();
});

function carregarProdutos() {
fetch('/api/produtos')
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
            row.innerHTML = `
            <td><img src="${produto.img_url}" alt="${produto.nome}" style="width: auto; height: 50px;"></td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco}</td>
            <td>${produto.quantidade}</td> 
            <td>${produto.status}</td>
            <td>${produto.categoria}</td>
            <td>${produto.descricao}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));
}
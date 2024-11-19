const productList = document.getElementById('product-list');

// Função para buscar produtos via API
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos'); // Rota da sua API
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const products = await response.json();
        exibirProdutos(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

// Função para exibir os produtos na página
function exibirProdutos(products) {
    //productList.innerHTML = ''; // Limpa o container
    console.log(products.produtos);

    products.produtos.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('food-item', `${product.categoria}-type`); // Adiciona classes dinamicamente

        // Construção do HTML do produto (adapte conforme necessário)
        productItem.innerHTML = `
            <div class="item-wrap bottom-up play-on-scroll">
                <div class="item-img">
                    <div class="img-holder bg-img" style="background-image: url(${product.imagem || 'img/logo2.png'});"></div> </div>
                <div class="item-info">
                    <div>
                        <h3>${product.nome}</h3>
                        <span>${product.preco}</span>
                    </div>
                    <div class="cart-btn" data-product-id="${product.id}">
                        <i class='bx bx-cart-alt'></i>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });

    // Adicione aqui a lógica do carrinho de compras (passo 4)
}

// Chama a função para buscar os produtos ao carregar a página
carregarProdutos();

// Lógica para filtrar por categoria (mantém a mesma lógica do seu código anterior, 
// adaptando para usar as classes dinâmicas adicionadas acima)
// ...
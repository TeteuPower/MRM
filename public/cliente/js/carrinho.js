carregarProdutos();

// Função para buscar produtos via API
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos'); // Rota da sua API
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const products = await response.json();
        exibirProdutos(products);
        loop();
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
}

// Função para exibir os produtos na página
function exibirProdutos(products) {
    productList.innerHTML = ''; // Limpa o container
    //console.log(products.produtos);

    products.produtos.forEach(product => {
        //console.log(product);
        const productItem = document.createElement('div');
        productItem.classList.add('food-item', `${product.categoria}-type`); // Adiciona classes dinamicamente

        // Construção do HTML do produto
        productItem.innerHTML = `
            <div class="item-wrap bottom-up play-on-scroll">
                <div class="item-img">
                    <div class="img-holder bg-img" style="background-image: url(${product.imagem || 'img/logo2.png'});"></div> </div>
                <div class="item-info">
                    <div class="cart-btn" data-product-id="${product.id}">
                        <i class='bx bx-up-arrow-alt increase-btn'></i>
                        <input type="number" min="1" max="10" value="1" class="quantity-input">
                        <i class='bx bx-down-arrow-alt decrease-btn'></i>
                        <i class='bx bx-cart-alt add-to-cart-btn'></i>
                    </div>
                    <div>
                        <h3>${product.nome}</h3>
                        <span>${product.preco}</span>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });

    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('bx-cart-alt')) {
            const productId = event.target.closest('.cart-btn').dataset.productId;
            addToCart(productId);
        }
    });

    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        abrirCarrinho();
    }
}

const modalBtn = document.getElementById('modal-btn');
const logoCarrinho = document.querySelector('.logo-carrinho');
const textoCabecalho = document.querySelector('.texto-cabecalho');
const carrinho = document.querySelector('.carrinho');
const btnCheckout = document.querySelector('.btn-checkout');

// Função para abrir o modal
document.querySelector('.bx-cart-alt').addEventListener('click', function(event) {
    abrirCarrinho();
});
function abrirCarrinho() {
    modalBtn.checked = true;
    updateCartModal();
    logoCarrinho.classList.add('start');
    textoCabecalho.classList.add('start');
    carrinho.classList.add('start'); 
    btnCheckout.classList.add('start');
};

// Função para fechar o modal
// Adiciona evento de clique para fechar o modal
document.querySelector('.close-modal').addEventListener('click', closeModal);
function closeModal() {
    const modal = document.getElementById('modal-btn');
    logoCarrinho.classList.remove('start');
    textoCabecalho.classList.remove('start');
    carrinho.classList.remove('start');
    btnCheckout.classList.remove('start');
    modal.checked = false; // Desmarca o checkbox, fechando o modal
}

//Limpar carrinho
document.getElementById('checkout-limpar').addEventListener('click', limparCarrinho);
function limparCarrinho() {
    // Remover todos os itens do carrinho do localStorage e atualizar o modal
    if (confirm('Deseja realmente limpar o carrinho?')) {
        localStorage.removeItem('cart');
        updateCartModal();
    } else {
        return; // Interrompe a função se o usuário cancelar
    }
}

// Função para atualizar o conteúdo do carrinho no modal
function updateCartModal() {
    let total = 0;

    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Limpa a lista

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Seu carrinho está vazio.</li>';
        document.getElementById('cart-total').textContent = 'Total: R$ 0.00';
        return;
    }

    //Uma chamada à API para obter os detalhes dos produtos.  

    cart.forEach(async productId => {
        try{
            const response = await fetch(`/api/produtos/${productId}`);
            const product = await response.json();

            const listItem = document.createElement('li');
            listItem.innerHTML = `${product.nome} - R$ ${parseFloat(product.preco).toFixed(2)}`; //Ajustado para mostrar o preço formatado
            total += parseFloat(product.preco);
            //console.log(total);
            cartItems.appendChild(listItem);
            document.getElementById('cart-total').textContent = `Total: R$ ${total.toFixed(2)}`; 
        } catch (error){
            console.error("erro ao obter dados do produto", error);
            //Adicione tratamento de erro aqui
        }
    });
}

//Chama a função para atualizar o carrinho quando o modal é aberto
document.getElementById('cart-modal').addEventListener('shown.bs.modal', updateCartModal); //Use um evento mais apropriado para seu framework

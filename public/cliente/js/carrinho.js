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
                        <input type="number" min="1" value="1" class="quantity-input">
                        <i class='bx bx-down-arrow-alt decrease-btn'></i>
                        <i class='bx bx-cart-add add-to-cart-btn'></i>
                    </div>
                    <div>
                        <h3>${product.nome}</h3>
                        <span>R$ ${formatarValor(product.preco)}</span>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });

    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('bx-cart-add')) {
            const productId = event.target.closest('.cart-btn').dataset.productId;
            const quantity = event.target.closest('.cart-btn').querySelector('.quantity-input').value;
            addToCart(productId, quantity);
        }

        if (event.target.classList.contains('increase-btn')) {
            const quantity = event.target.closest('.cart-btn').querySelector('.quantity-input').value;
            event.target.closest('.cart-btn').querySelector('.quantity-input').value = parseFloat(quantity) + 1;
        }

        if (event.target.classList.contains('decrease-btn')) {
            const quantity = event.target.closest('.cart-btn').querySelector('.quantity-input').value;
            event.target.closest('.cart-btn').querySelector('.quantity-input').value = parseFloat(quantity) - 1;
            if (parseFloat(quantity) === 1) {
                //console.log(quantity);
                event.target.closest('.cart-btn').querySelector('.quantity-input').value = 1;
            }
        }
    });

    function addToCart(productId, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const produtoJaExiste = cart.find(item => item.productId === productId);
        if (produtoJaExiste) {
            //console.log(produtoJaExiste.quantity , quantity);
            produtoJaExiste.quantity = parseFloat(produtoJaExiste.quantity) + parseFloat(quantity);
        } else {
            cart.push({ productId: parseInt(productId), quantity: parseFloat(quantity) });
        }

        //cart.push(productId);
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
    //console.log(cart);
    cart.forEach(async item => {
        try{
            //console.log( item.productId );
            const response = await fetch(`/api/produtos/${item.productId}`);
            const product = await response.json();

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item">
                    <img src="${product.imagem || '../img/logo2.png'}" alt="${product.nome}" class="cart-item-image">
                    <div class="cart-item-info">  
                        <span class="cart-item-name">${product.nome}</span>
                        <span class="cart-item-price">R$ ${formatarValor(parseFloat(product.preco).toFixed(2))}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="decrementQuantity(${product.id})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="incrementQuantity(${product.id})">+</button>
                    </div>
                </div>
            `;
            total += parseFloat(product.preco * item.quantity);
            //console.log(total);
            cartItems.appendChild(listItem);
            document.getElementById('cart-total').textContent = `Total: R$ ${formatarValor(total.toFixed(2))}`; 
        } catch (error){
            console.error("erro ao obter dados do produto", error);
            //Adicione tratamento de erro aqui
        }
    });
}

function incrementQuantity(productId) {
    //console.log(productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => parseInt(item.productId) === productId);
    //console.log(cart);
    if (item) {
        item.quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartModal();
    }
}
function decrementQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => parseInt(item.productId) === productId);
    if (item && parseInt(item.quantity) > 1) {
        item.quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartModal();
    }
    //Se quantidade for igual a 1 exclui o produto do carrinho
    else if (item && parseInt(item.quantity) === 1) {
        //console.log(item.productId);
        cart.splice(cart.indexOf(item), 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartModal();
    }
}

//Chama a função para atualizar o carrinho quando o modal é aberto
document.getElementById('cart-modal').addEventListener('shown.bs.modal', updateCartModal); //Use um evento mais apropriado para seu framework

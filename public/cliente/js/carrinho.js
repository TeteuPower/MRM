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
    //productList.innerHTML = ''; // Limpa o container
    //console.log(products.produtos);

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

    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('bx-cart-alt')) {
            const productId = event.target.closest('.cart-btn').dataset.productId;
            addToCart(productId);
            //openCartModal(); // Abre o modal ao adicionar um item
        }
    });

    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartModal();
        openModal();
        //alert('Produto adicionado ao carrinho!'); // Ou atualize a interface do carrinho
    }
}

const modalBtn = document.getElementById('modal-btn');
const logoCarrinho = document.querySelector('.logo-carrinho');
const textoCabecalho = document.querySelector('.texto-cabecalho');
const carrinho = document.querySelector('.carrinho');
const btnCheckout = document.querySelector('.btn-checkout');

modalBtn.addEventListener('change', () => {
    if (modalBtn.checked) {
        updateCartModal();
        logoCarrinho.classList.add('start');
        textoCabecalho.classList.add('start');
        carrinho.classList.add('start'); 
        btnCheckout.classList.add('start');
    } else {
        logoCarrinho.classList.remove('start');
        textoCabecalho.classList.remove('start');
        carrinho.classList.remove('start');
        btnCheckout.classList.remove('start');
    }
});

// Função para abrir o modal
function openModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'flex';
    //AOS.refresh(); // Atualiza animações AOS após alterações no DOM
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('modal-btn');
    logoCarrinho.classList.remove('start');
    textoCabecalho.classList.remove('start');
    carrinho.classList.remove('start');
    btnCheckout.classList.remove('start');
    modal.checked = false; // Desmarca o checkbox, fechando o modal
}

// Adiciona evento de clique para fechar o modal
document.querySelector('.close-modal').addEventListener('click', closeModal);

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

    //Aqui precisaremos de uma chamada à API para obter os detalhes dos produtos.  
    // Vou assumir que /api/produtos/:id retorna um produto.  Adapte conforme necessário

    cart.forEach(async productId => {
        try{
            const response = await fetch(`/api/produtos/${productId}`);
            const product = await response.json();

            const listItem = document.createElement('li');
            listItem.innerHTML = `${product.nome} - R$ ${parseFloat(product.preco).toFixed(2)}`; //Ajustado para mostrar o preço formatado
            total += parseFloat(product.preco);
            console.log(total);
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

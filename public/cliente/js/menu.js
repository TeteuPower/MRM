verificarAutenticacao();
popularMenu();
carregarProdutos();

//Inicia depois no dom
window.addEventListener('DOMContentLoaded', () => {
    //Botão de #E-Commerce
    document.getElementById('btn-slogan').addEventListener('click', () => {
        const ecommerceSection = document.getElementById('E-Commerce');
        if (ecommerceSection) {
            ecommerceSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

//resgata o nome de usuário do local storage
const nomeUsuario = localStorage.getItem('Usuario');

//exibe o nome de usuário no menu
document.getElementById('nome-usuario').textContent = `Olá, ${nomeUsuario}!`;


//Cria função de Logout
document.getElementById('logout-btn').addEventListener('click', () => { logout(); });
function logout() {
    localStorage.removeItem('Usuario');
    localStorage.removeItem('tokenUser');
    window.location.href = '/';
    alert('Você foi deslogado com sucesso!');
}

//document.getElementById('btn-abrir-modal').addEventListener('click', abrirCarrinho);

//Modifica a página se o usuário já tem um carrinho ativo
function popularMenu() {
    const carrinho = JSON.parse(localStorage.getItem('cart')) ?? [];

    if (carrinho.length > 0) {
        document.getElementById('carrinho-dinamico').style.display = 'block';
        const menuOcultar = document.getElementById('home')
        menuOcultar.style.display = 'none';
        //document.getElementById('h1-slogan').textContent = `Finalize sua compra!`;
        document.getElementById('carrinho-dinamico').innerHTML = `

        
        <div class="fullheight-dinamico align-items-center-menu2 bg-img bg-img-fixed">

            <h1 class="left-to-right play-on-scroll">
                Finalize sua compra!<i class='bx bx-cart-alt right-to-left play-on-scroll'></i>
            </h1>
            <div class="divisoria-tela">

                <section class="formulario left-to-right play-on-scroll">
                    <h3 class="left-to-right play-on-scroll">
                    Contato
                    </h3>
                    <form>
                        <div class="input-group left-to-right play-on-scroll">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required>
                        </div>

                        <div class="nome-completo left-to-right play-on-scroll">
                            <div class="input-group">
                                <label for="nome">Nome:</label>
                                <input type="text" id="nome" name="nome" required>
                            </div>
                            <div class="input-group">
                                <label for="sobrenome">Sobrenome:</label>
                                <input type="text" id="sobrenome" name="sobrenome" required>
                            </div>
                        </div>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="telefone">Telefone:</label>
                            <input type="tel" id="telefone" name="telefone" required>
                        </div>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="empresa">Empresa (opcional):</label>
                            <input type="text" id="empresa" name="empresa">
                        </div>

                        <h3 class="left-to-right play-on-scroll">
                            Endereço
                        </h3>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="cep">CEP:</label>
                            <input type="text" id="cep" name="cep" required>
                        </div>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="endereco">Endereço:</label>
                            <input type="text" id="endereco" name="endereco" required>
                        </div>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="bairro">Bairro:</label>
                            <input type="text" id="bairro" name="bairro" required>
                        </div>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="cidade">Cidade:</label>
                            <input type="text" id="cidade" name="cidade" required>
                        </div>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="estado">Estado:</label>
                            <input type="text" id="estado" name="estado" required>
                        </div>

                        <div class="input-group left-to-right play-on-scroll">
                            <label for="complemento">Complemento:</label>
                            <input type="text" id="complemento" name="complemento">
                        </div>

                    </form>

                    <button class="btn-enviar left-to-right play-on-scroll" id="btn-enviar">
                        Finalizar Pedido
                    </button>


                </section>

                <section class="resumo right-to-left play-on-scroll" id="resumo">
                    <h3>
                        Resumo do Pedido
                    </h3>
                    <div class="resumo right-to-left play-on-scroll" id="resumo-itens">
                        <!-- RESUMO INSERIDO AQUI VIA JS -->
                    </div>
                    <div class="botoes-resumo">
                        <button class="btn-enviar left-to-right play-on-scroll" id="btn-enviar">
                            Finalizar Pedido
                        </button>
                        <button class="btn-enviar left-to-right play-on-scroll" id="limpar-carrinho">
                            Limpar Carrinho
                        </button>
                    </div>
                </section>
            </div>
        </div>


        `;
        document.getElementById('btn-slogan').style.display = 'none';
        /*document.getElementById('div-btn-slogan').innerHTML = `
        <div class="botoes-slogan">
            <button class="btn-abrir-modal left-to-right play-on-scroll" id="btn-abrir-modal">
                Conferir carrinho (temporário)
            </button>
            <button class="btn-abrir-modal left-to-right play-on-scroll" id="btn-finalizar-venda">
                Finalizar Compra!
            </button>
        </div>
        `;*/
        popularResumo();
    } else {   
        document.getElementById('carrinho-dinamico').style.display = 'none';
        document.getElementById('home').style.display = 'block';
        document.getElementById('btn-slogan').style.display = 'block';
        //alert('Carrinho vazio!');
        //document.getElementById('carrinho-link').textContent = 'Carrinho';
        /*
                div class="promoCode left-to-right play-on-scroll">
                    <label for="promoCode">Código Promocional:</label>
                    <input type="text" id="promoCode" name="promoCode" placholder="Enter Code" >
                    <a class="promo-btn"></a>
                    <p>Essa área ainda está em construção, por enquanto utilize o modal</p>
                </div>
        */
    }
}

//Limpar carrinho
function limparCarrinho() {
    //document.getElementById('limpar-carrinho').addEventListener('click', limparCarrinho);
    // Remover todos os itens do carrinho do localStorage e atualizar o modal
    if (confirm('Deseja realmente limpar o carrinho?')) {
        localStorage.removeItem('cart');
        popularMenu();
    } else {
        return; // Interrompe a função se o usuário cancelar
    }
}

// Função para atualizar o conteúdo do carrinho no modal
function popularResumo() {
    let total = 0;

    const cartItems = document.getElementById('resumo-itens');
    cartItems.innerHTML = ''; // Limpa a lista

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Seu carrinho está vazio.</li>';
        document.getElementById('cart-total').textContent = 'Total: R$ 0.00';
        return;
    }

    //Uma chamada à API para obter os detalhes dos produtos.  
    //console.log(cart);
    //Organiza em ordem crescente pelo id dos objetos
    cart.sort((a, b) => a.id - b.id); // Ordena o array 'cart' pelo 'id' em ordem crescente
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
            document.getElementById('limpar-carrinho').addEventListener('click', limparCarrinho);
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
        const produtoJaExiste = cart.find(item => parseInt(item.productId) === parseInt(productId));

        if (produtoJaExiste) {
            //console.log(produtoJaExiste.quantity , quantity);
            produtoJaExiste.quantity = parseFloat(produtoJaExiste.quantity) + parseFloat(quantity);
        } else {
            cart.push({ productId: parseInt(productId), quantity: parseFloat(quantity) });
        }

        //cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        //chama função que atualiza o resumo:
        alert('Produto adicionado ao carrinho.');
        const resumoSection = document.getElementById('btn-enviar');
        if (resumoSection) {
            console.log('tentei')
            resumoSection.scrollIntoView({ behavior: 'smooth' });
        }
        popularMenu();
        //popularResumo();

    }
}
verificarAutenticacao();
popularMenu();
carregarProdutos();
popularEnderecos();

//Inicia depois no dom
window.addEventListener('DOMContentLoaded', () => {
    //Botão de #E-Commerce
    document.getElementById('btn-slogan').addEventListener('click', () => {
        const ecommerceSection = document.getElementById('E-Commerce');
        if (ecommerceSection) {
            ecommerceSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    saudacao();
});

function saudacao() {
    //resgata o nome de usuário do local storage
    const nomeUsuario = localStorage.getItem('Usuario');

    //exibe o nome de usuário no menu
    document.getElementById('nome-usuario').textContent = `Olá, ${nomeUsuario}!`;
}



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
        /*document.getElementById('carrinho-dinamico').innerHTML = `

        







        `;*/
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

        //Adicionando função ao botão de confirmar dados
        document.getElementById('btn-confirmar-dados').addEventListener('click', confirmarDados);
        popularInputs ();

        const cpfInput = document.getElementById('cpf');

        cpfInput.addEventListener('input', () => {
        let cpf = cpfInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        cpfInput.value = cpf;
        });

        const telefoneInput = document.getElementById('telefone');

        telefoneInput.addEventListener('input', () => {
        let telefone = telefoneInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Adiciona o nono dígito se necessário
            if (telefone.length > 4 && telefone[2] != 9) {
                telefone = telefone.slice(0, 2) + '9' + telefone.slice(2)
            }

        let formattedTelefone = '';

            if(telefone.length > 0) {
                formattedTelefone = "(" + telefone.substring(0, 2) + ") ";
            }

            if(telefone.length > 2) {
                formattedTelefone += telefone.substring(2,3) + " ";
            }

            if(telefone.length > 3) {
                formattedTelefone += telefone.substring(3, 7) + "-";
            }
            if(telefone.length > 7) {
                formattedTelefone += telefone.substring(7, 11);
            }


        telefoneInput.value = formattedTelefone;
        });

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
async function popularResumo() {
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
    //Oraganiza em ordem crescente pela POSIÇÃO dos objetos
    for (const item of cart) {
        try{
            //console.log( item.productId, index );
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

            document.getElementById('resumo-total').innerHTML = `

            <div class="valores-resumo">
                <h3 class="left-to-right play-on-scroll">Checkout</h3>
                <!-- Cupom de desconto -->
                <div class="input-group input-group-checkout">
                    <label for="promoCode">Código Promocional:</label>
                    <input type="text" id="promoCode" name="promoCode" placholder="Enter Code" >
                    <button class="promo-btn"></button>
                </div>
                <br>
                <span class="cart-total" id="frete">Frete: 'Selecione um endereço'</span>
                <br>
                <span class="cart-total" id="desconto">Desconto: R$ 0,00 </span>
                <br>
                <span class="cart-total">Total: R$ ${formatarValor(total.toFixed(2))}</span>

            </div>
            
            `; 
        } catch (error){
            console.error("erro ao obter dados do produto", error);
            //Adicione tratamento de erro aqui
        }
    };

    if (cart.length > 0) {
        cartItems.insertAdjacentHTML('beforeend', `
            <div class="botoes-resumo">
                <button class="btn-enviar btn-enviar-3 left-to-right play-on-scroll" id="limpar-carrinho">
                    Limpar Carrinho
                </button>
                <button class="btn-enviar-2 left-to-right play-on-scroll" id="adicionar-mais-produtos">
                    Continuar comprando
                </button>
            </div>
        `);

        document.getElementById('limpar-carrinho').addEventListener('click', limparCarrinho);

        document.getElementById('adicionar-mais-produtos').addEventListener('click', () => {
            const ecommerceSection = document.getElementById('E-Commerce');
            if (ecommerceSection) {
                ecommerceSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

$(document).ready(function() {
    $('#toggle-endereco').click(function() {
        $('#endereco-container').toggleClass('mostrar');
    });
});

$(document).ready(function() {
    $('#toggle-endereco-salvo').click(function() {
        $('#enderecos-salvos').toggleClass('mostrar');
    });
});

//Disparar função confereCep() e confereCpfBlur() quando o cep e o cpf estiver preenchido
document.getElementById('cep').addEventListener('blur', confereCep);
document.getElementById('cpf').addEventListener('blur', confereCpfBlur);

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
            //console.log('tentei')
            resumoSection.scrollIntoView({ behavior: 'smooth' });
        }
        popularMenu();
        //popularResumo();

    }
}

function popularInputs () {
    const email = document.getElementById('email');
    const nome = document.getElementById('nome');
    const sobrenome = document.getElementById('sobrenome');
    const telefone = document.getElementById('telefone');
    const cpf = document.getElementById('cpf');

    //Faz uma consulta a api api/usuarios/me enviando o token do localStorage
    fetch('/api/usuarios/me', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('tokenUser')
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        email.value = data.email;
        nome.value = data.nome;
        sobrenome.value = data.sobrenome;
        telefone.value = data.telefone;
        cpf.value = data.cpf;
        //Criar lógica para quando existir o dado, adicionar um disabled ao input junto
        if (email.value !== '') {
            email.disabled = true;
        }
        if (nome.value!== '') {
            nome.disabled = true;
        }
        if (sobrenome.value !== '') {
            sobrenome.disabled = true;
        }
        if (telefone.value !== '') {
            telefone.disabled = true;
        }
        if (cpf.value !== '') {
            cpf.disabled = true;
        }
    })

}

function popularEnderecos() {
    const enderecosSection = document.getElementById('enderecos-salvos-conteudo');
    enderecosSection.innerHTML = ''; // Limpa o container

    fetch('/api/usuarios/enderecos', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('tokenUser')
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        data.forEach(endereco => {
            const enderecoItem = document.createElement('div');
            //enderecoItem.classList.add('input-group-enderecos left-to-right play-on-scroll');
            enderecoItem.innerHTML = `
            <div class="input-group-enderecos left-to-right play-on-scroll" data-id="${endereco.id}">
                <div class="conteudo-endereco-salvo" >
                    <h3>${endereco.apelido}</h3>
                    <p><strong style="color: black;">Endereço:</strong> ${endereco.endereco}</p>
                    <p><strong style="color: black;">N°:</strong> ${endereco.numero}</p>
                    <p><strong style="color: black;">Bairro:</strong> ${endereco.bairro}</p>
                    <p><strong style="color: black;">Cidade:</strong> ${endereco.cidade}</p>
                    <p><strong style="color: black;">Estado:</strong> ${endereco.estado}</p>
                    <p><strong style="color: black;">Complemento:</strong> ${endereco.complemento}</p>
                    <button class="botao-excluir" data-id="${endereco.id}"><i class='bx bx-trash'></i></button>
                    <input type="hidden" id="cep-${endereco.id}" value="${endereco.cep}">
                </div>
            </div>
            `;
            enderecosSection.appendChild(enderecoItem);
        })

        enderecosSection.addEventListener('click', (event) => {
            if (event.target.classList.contains('bx-trash')) { // Clica no ícone
                 const botaoExcluir = event.target.parentNode;
                const enderecoId = botaoExcluir.dataset.id;
                excluirEndereco(enderecoId);
            } else if (event.target.classList.contains("botao-excluir")) { // Clica no botão
                const enderecoId = event.target.dataset.id;
                excluirEndereco(enderecoId);
            }
        });

        // Seleciona endereço quando clicado
        enderecosSection.addEventListener('click', (event) => {
            const conteudoClicado = event.target.closest('.input-group-enderecos');

            if (conteudoClicado) {  // Verifica se clicou dentro de um .conteudo-endereco-salvo
                //Verifica se já existe um endereço selecionado no local storage, se existir excluir o atual e substitui pelo novo
                    const enderecoId = conteudoClicado.dataset.id;
                    //console.log("ID do endereço clicado:", enderecoId);
                    // Salva o endereço selecionado no LocalStorage
                    localStorage.setItem('enderecoId', enderecoId);
                    //Atualiza valor do frete
                    atualizarFrete(enderecoId);
                    // Adicione class "selecionado" ao endereço clicado
                    const enderecos = document.querySelectorAll('.input-group-enderecos');
                    enderecos.forEach(endereco => {
                        //console.log(endereco);
                        endereco.classList.remove('selecionado');
                        if (endereco.dataset.id === enderecoId) { // Adiciona somente ao clicado
                            endereco.classList.add('selecionado');
                        }
                    });
            }
            //Oculta sem-enderecos-salvos
            const semEnderecosSalvos = document.getElementById('sem-enderecos-salvos');
            semEnderecosSalvos.style.display = 'none';

        })
    });

}

async function excluirEndereco(enderecoId) {
    if (confirm('Tem certeza de que deseja excluir este endereço?')) { //confirmação antes de excluir.
        try {
            const response = await fetch(`/api/usuarios/enderecos/${enderecoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('tokenUser')
                }
            });

            if (response.ok) {
                // Remove o endereço do DOM
                const enderecoDiv = document.querySelector(`.botao-excluir[data-id="${enderecoId}"]`).closest('.input-group-enderecos');
                enderecoDiv.remove();
                alert('Endereço excluído com sucesso!');
            } else {
                const errorData = await response.json();
                alert('Erro ao excluir endereço: ' + errorData.error);
            }
        } catch (error) {
            console.error('Erro ao excluir endereço:', error);
            alert('Erro ao excluir endereço.');
        }
    }
}

function confirmarDados() {
    const nomeInput = document.getElementById('nome');
    const nome = nomeInput.value;
    const sobrenomeInput = document.getElementById('sobrenome');
    const sobrenome = sobrenomeInput.value;
    const telefoneComSimbolos = document.getElementById('telefone');
    const telefone = telefoneComSimbolos.value.replace(/\D/g, '');
    const cpfComSimbolos = document.getElementById('cpf');
    const cpf = cpfComSimbolos.value.replace(/\D/g, '');
    const nomeEnderecoInput = document.getElementById('nome-endereco');
    const nomeEndereco = nomeEnderecoInput.value;
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    const enderecoInput = document.getElementById('endereco');
    const endereco = enderecoInput.value;
    const numeroInput = document.getElementById('numero');
    const numero = numeroInput.value;
    const bairroInput = document.getElementById('bairro');
    const bairro = bairroInput.value;
    const cidadeInput = document.getElementById('cidade');
    const cidade = cidadeInput.value;
    const estadoInput = document.getElementById('estado');
    const estado = estadoInput.value;
    const complementoInput = document.getElementById('complemento');
    const complemento = complementoInput.value;
    const telefoneInput = document.getElementById('telefone');
    const cpfInput = document.getElementById('cpf');

    //Usar função de validação de CPF
    if (!TestaCPF(cpf)) {
        alert('Por favor, insira um CPF válido.');
        return;
    }

    //Valida os dados do endereço
    if (telefone.length < 11) {
        alert('Por favor, insira um telefone com DDD.');
        return;
    }
    if (sobrenome === '') {
        alert('Por favor, preencha o sobrenome.');
        return;
    }
    if (telefone === '') {
        alert('Por favor, preencha seu telefone.');
        return;
    }
    if (cep === '') {
        alert('Por favor, preencha o CEP.');
        return;
    }
    if (endereco === '') {
        alert('Por favor, preencha o endereço.');
        return;
    }
    if (numero === '') {
        alert('Por favor, preencha o número.');
        return;
    }
    if (bairro === '') {
        alert('Por favor, preencha o bairro.');
        return;
    }
    if (cidade === '') {
        alert('Por favor, preencha a cidade.');
        return;
    }
    //Atualiza dados do cliente
    fetch('/api/usuarios/me', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('tokenUser')
        },
        body: JSON.stringify({ nome, telefone, sobrenome, cpf })
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        //alert('Dados atualizados com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao atualizar dados:', error);
        alert('Erro ao atualizar dados.');
    });

    //console.log(cep);
    //Atualiza dados do endereço
    //console.log('Nome endereço:', nomeEndereco, ';', 'CEP:', cep, ';', 'Endereço:', endereco, ';', 'Número:', numero, ';', 'Bairro:', bairro, ';', 'Cidade:', cidade, ';', 'Estado:', estado, ';', 'Complemento:', complemento);
    fetch('api/usuarios/enderecos' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('tokenUser')
        },
        body: JSON.stringify({ nomeEndereco, cep, endereco, numero, bairro, cidade, estado, complemento })
    })
    .then(response => response.json())
    .then(data => {
        //Remove a classe "mostrar" do endereco-container
        const enderecoContainer = document.getElementById('endereco-container');
        enderecoContainer.classList.remove('mostrar');
        //console.log(data);
        //alert('Novo endereço adicionado com sucesso!');
        //bloqueia todos os campos de dados
        nomeEnderecoInput.disabled = true;
        sobrenomeInput.disabled = true;
        telefoneInput.disabled = true;
        cpfInput.disabled = true;
        enderecoInput.disabled = true;
        numeroInput.disabled = true;
        cepInput.disabled = true;
        bairroInput.disabled = true;
        cidadeInput.disabled = true;
        estadoInput.disabled = true;
        complementoInput.disabled = true;
        //Um atraso de meio segundo para iniciar a função de popular enderecos
        setTimeout(() => {
            popularEnderecos();
        }, 500);
    })
    .catch(error => {
        console.error('Erro ao atualizar endereço:', error);
        alert('Erro ao atualizar endereço.');
    });

}

function confereCep() { //evento blur dispara quando input perde o foco
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    if ($('#cep').is(':visible')) {
        fetch(`/busca-cep/${cep}`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP inválido.');
                cepInput.value = '';
                endereco.value = '';
                bairro.value = '';
                cidade.value = '';
                estado.value = '';
                endereco.disabled = false;
                bairro.disabled = false;
                cidade.disabled = false;
                estado.disabled = false;
                return;
            }
            //console.log(data);
            endereco.value = data.logradouro;
            bairro.value = data.bairro;
            cidade.value = data.localidade;
            estado.value = data.uf;
            if (endereco.value !== '') {
                endereco.disabled = true;
            }
            if (bairro.value !== '') {
                bairro.disabled = true;
            }
            if (cidade.value !== '') {
                cidade.disabled = true;
            }
            if (estado.value !== '') {
                estado.disabled = true;
            }
        })
        .catch(error => {
            //console.error('Erro ao buscar o CEP:', error);
            //alert('Erro ao buscar o CEP.');
        });
    }
};

function confereCpfBlur() {
    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value.replace(/\D/g, '');
    if (!TestaCPF(cpf)) {
        alert('Por favor, insira um CPF válido.');
        cpfInput.value = '';
    }
}

function atualizarFrete(enderecoId) {
    const freteInput = document.getElementById('frete');
    const cepValue = document.getElementById(`cep-${enderecoId}`).value.replace(/\D/g, '');
    //console.log(cepValue);
    
}
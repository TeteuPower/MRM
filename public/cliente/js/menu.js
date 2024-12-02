verificarAutenticacao();
popularMenu();

//resgata o nome de usuário do local storage
const nomeUsuario = localStorage.getItem('Usuario');

//exibe o nome de usuário no menu
document.getElementById('nome-usuario').textContent = `Olá, ${nomeUsuario}!`;

//Botão de #E-Commerce
document.getElementById('btn-slogan').addEventListener('click', () => {
    const ecommerceSection = document.getElementById('E-Commerce');
    if (ecommerceSection) {
        ecommerceSection.scrollIntoView({ behavior: 'smooth' });
    }
});

//Cria função de Logout
document.getElementById('logout-btn').addEventListener('click', () => { logout(); });
function logout() {
    localStorage.removeItem('Usuario');
    localStorage.removeItem('tokenUser');
    window.location.href = '/';
    alert('Você foi deslogado com sucesso!');
}

document.getElementById('btn-abrir-modal').addEventListener('click', abrirCarrinho);

//Modifica a página se o usuário já tem um carrinho ativo
function popularMenu() {
    const carrinho = JSON.parse(localStorage.getItem('cart')) ?? [];

    if (carrinho.length > 0) {
        const menuOcultar = document.getElementById('home')
        menuOcultar.style.display = 'none';
        document.getElementById('h1-slogan').textContent = `Finalize sua compra!`;
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

                </section>

                <section class="resumo right-to-left play-on-scroll">
                    <div class="resumo-conteudo">
                        <h3>
                            Resumo
                        </h3>

                        <div class="resumo-itens">
                            <ul>
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                                <li>Item 4</li>
                            </ul>
                        </div>
                        <div class="resumo-total right-to-left play-on-scroll">
                            <p>Total: R$ 0,00</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        `;
        document.getElementById('btn-slogan').style.display = 'none';
        document.getElementById('div-btn-slogan').innerHTML = `
        <div class="botoes-slogan">
            <button class="btn-abrir-modal left-to-right play-on-scroll" id="btn-abrir-modal">
                Conferir carrinho (temporário)
            </button>
            <button class="btn-abrir-modal left-to-right play-on-scroll" id="btn-finalizar-venda">
                Finalizar Compra!
            </button>
        </div>
        `;
    } else {
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
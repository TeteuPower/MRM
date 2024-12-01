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
        document.getElementById('h1-slogan').textContent = `Finalize sua compra!`;
        document.getElementById('p-slogan').innerHTML = `
        <div class="promoCode">
            <label for="promoCode">Código Promocional:</label>
            <input type="text" id="promoCode" name="promoCode" placholder="Enter Code" >
            <a class="promo-btn"></a>
            <p>Essa área ainda está em construção, por enquanto utilize o modal</p>
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
    }
}
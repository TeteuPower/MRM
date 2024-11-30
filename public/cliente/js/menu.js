verificarAutenticacao();
//popularMenu();

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

//Modifica a página se o usuário já tem um carrinho ativo
function popularMenu() {
    const carrinho = JSON.parse(localStorage.getItem('cart')) ?? [];

    if (carrinho.length > 0) {
        document.getElementById('h1-slogan').textContent = `Finalize sua compra!`;
        document.getElementById('p-slogan').innerHTML = `
        <div class="promoCode">
            <label for="promo">Código Promocional:</label>
            <input type="text" name="promo" placholder="Enter Code" >
            <a class="promo-btn"></a>
        </div>
        `;
    } else {
        alert('Carrinho vazio!');
        //document.getElementById('carrinho-link').textContent = 'Carrinho';
    }
}
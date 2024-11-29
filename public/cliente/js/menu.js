verificarAutenticacao();

//resgata o nome de usuário do local storage
const nomeUsuario = localStorage.getItem('Usuario');

//exibe o nome de usuário no menu
document.getElementById('nome-usuario').textContent = `Olá, ${nomeUsuario}!`;
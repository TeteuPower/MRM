// on scroll animation

let scroll = window.requestAnimationFrame || function(callback) {window.setTimeout(callback, 1000/60)}

let elToShow = document.querySelectorAll('.play-on-scroll')

isElInViewPort = (el) => {
    let rect = el.getBoundingClientRect()

    return (
        (rect.top <= 0 && rect.bottom >= 0)
        ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) && rect.top <= (window.innerHeight || document.documentElement.clientHeight))
        ||
        (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    )
}

// Adapte sua função loop para funcionar com o MutationObserver
function loop() {
    //Esta função agora só é executada para os elementos estáticos da página
    const staticElements = document.querySelectorAll('.play-on-scroll:not(.food-item)'); // Seleciona apenas elementos que não são produtos
    staticElements.forEach((item) => {
        if (isElInViewPort(item)) {
            item.classList.add('start');
        } else {
            item.classList.remove('start');
        }
    });
    scroll(loop);
}

loop()






verificarToken();

function verificarToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  if (!token) {
      // Redireciona para a página de login se não houver token
      alert(' Você precisa de um token para recuperar a senha');
      window.location.href = '/';
      return Promise.reject(false); // Retorna uma promessa rejeitada para evitar erros nas páginas protegidas
  }
}

document.getElementById('btn-recuperar-senha').addEventListener('click', recuperarSenha);

function recuperarSenha() {

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (senha === '' || confirmarSenha === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    };

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem');
        return;
    };

    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return;
    };

    //console.log(JSON.stringify({ token, senha }));
    fetch('api/usuarios/mudar-senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, senha }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = '/adm';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}
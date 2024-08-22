document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});

function checkAdminPassword() {
    const adminPassword = document.getElementById('adminPassword').value;
    const nomeAdministrador = localStorage.getItem('administrador');

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nomeAdministrador, senha: adminPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Autenticação bem-sucedida
            window.location.href = 'consultar_pedidos.html';
            alert(`Seja bem vindo, ${nomeAdministrador}!`);
        } else {
            // Senha incorreta
            alert('Senha incorreta!');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao verificar a senha.');
    });
}

// login.js

/*const formLogin = document.getElementById('loginForm');

formLogin.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('username').value;
    const senha = document.getElementById('password').value;

    // Faz uma requisição AJAX para a API de login
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Login bem-sucedido
            localStorage.setItem('administrador', data.administrador.nome);
            window.location.href = 'html/consultar_pedidos.html';
            alert(`Seja bem vindo, ${data.administrador.nome}!`);
        } else {
            // Senha incorreta
            alert('Senha incorreta!');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao verificar a senha. Por favor, tente novamente mais tarde.');
    });
});*/
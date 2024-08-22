document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});

/*function checkAdminPassword() {
    const adminPassword = document.getElementById('adminPassword').value;

    // Consulta SQL para verificar as credenciais do administrador
    const sql = `SELECT * FROM administradores WHERE nome = ? AND senha = ?`;

    // Executa a consulta
    db.query(sql, [localStorage.getItem('administrador'), adminPassword], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            alert('Erro ao verificar a senha. Por favor, tente novamente mais tarde.');
            return;
        }

        if (results.length > 0) {
            // Administrador encontrado
            const administrador = results[0]; // Obtém o primeiro resultado da consulta
            localStorage.setItem('administrador', administrador.nome);
            window.location.href = 'html/consultar_pedidos.html';
            alert(`Seja bem vindo, ${administrador.nome}!`);
        } else {
            // Senha incorreta
            alert('Senha incorreta!');
        }
    });
}*/

// login.js

const formLogin = document.getElementById('loginForm');

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
});
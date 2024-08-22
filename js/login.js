const db = require('./db'); // Importa o módulo de conexão com o banco de dados

document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});

function checkAdminPassword() {
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
}
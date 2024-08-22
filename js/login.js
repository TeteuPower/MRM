document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});

// login.js

// ... (seu código existente) ...

function checkAdminPassword() {
    const adminPassword = document.getElementById('adminPassword').value;

    // Faz uma requisição AJAX à API
    fetch(`/verificar-senha-admin?senha=${adminPassword}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição.');
            }
            return response.json();
        })
        .then(data => {
            // Senha correta!
            const administrador = data.administrador;

            // Define a chave "administrador" no Local Storage
            localStorage.setItem('administrador', administrador);

            // Redireciona para a página de consultar pedidos
            window.location.href = 'html/consultar_pedidos.html';

            // Exibe o alerta de boas-vindas
            alert(`Seja bem vindo, ${administrador}!`);
        })
        .catch(error => {
            // Senha incorreta ou erro na requisição
            alert('Senha incorreta ou erro ao verificar a senha.');
            console.error(error);
        });
}
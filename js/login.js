document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});


/*function checkAdminPassword() {
    const adminPassword = document.getElementById('adminPassword').value;

    // Consulta SQL para verificar a senha na tabela administradores
    const sql = `SELECT * FROM administradores WHERE senha = ?`;

    // Faz uma requisição AJAX à API genérica /consulta
    fetch(`/consulta?sql=${encodeURIComponent(sql)}¶ms=${JSON.stringify([adminPassword])}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição.');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                // Senha correta!
                const administrador = data[0].nome;

                // Define a chave "administrador" no Local Storage
                localStorage.setItem('administrador', administrador);

                // Redireciona para a página de consultar pedidos
                window.location.href = 'html/consultar_pedidos.html';

                // Exibe o alerta de boas-vindas
                alert(`Seja bem vindo, ${administrador}!`);
            } else {
                // Senha incorreta
                alert('Senha incorreta.');
            }
        })
        .catch(error => {
            // Senha incorreta ou erro na requisição
            alert('Senha incorreta ou erro ao verificar a senha.');
            console.error(error);
        });
}*/

// login.js

function checkAdminPassword() {
    const adminPassword = document.getElementById('adminPassword').value;

    // Faz uma requisição AJAX à API para obter os administradores
    fetch('/api/administradores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição.');
            }
            return response.json();
        })
        .then(administradores => {
            // Verifica se a senha corresponde a algum administrador
            const administrador = administradores.find(admin => admin.senha === adminPassword);

            if (administrador) {
                // Senha correta!
                localStorage.setItem('administrador', administrador.nome);
                window.location.href = 'html/consultar_pedidos.html';
                alert(`Seja bem vindo, ${administrador.nome}!`);
            } else {
                // Senha incorreta
                alert('Senha incorreta.');
            }
        })
        .catch(error => {
            // Erro na requisição
            alert('Erro ao verificar a senha.');
            console.error(error);
        });
}
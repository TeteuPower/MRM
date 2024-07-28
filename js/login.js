document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});

function checkAdminPassword() {
    const adminPassword = document.getElementById('adminPassword').value;
    const admins = {
        'Matheus': 'adm123',
        'Maithê': 'maithe123',
        'Rafael': 'rafael123'
    };

    for (const nome in admins) {
        if (admins[nome] === adminPassword) {
            localStorage.setItem('administrador', nome);
            window.location.href = 'html/consultar_pedidos.html';
            alert(`Seja bem vindo, ${nome}!`);
            return; // Encerra a função após encontrar o administrador
        }
    }

    // Se a senha não corresponder a nenhum administrador
    alert('Senha incorreta!');
}
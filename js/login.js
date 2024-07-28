document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});

function checkAdminPassword() {
    var adminPassword = document.getElementById('adminPassword').value;
    if (adminPassword === 'adm123') {
        localStorage.setItem('administrador', 'true');
        window.location.href = 'html/consultar_pedidos.html'; 
    } else {
        alert('Senha incorreta!');
    }
}
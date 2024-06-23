document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});

function checkAdminPassword() {
    var adminPassword = document.getElementById('adminPassword').value;
    if (adminPassword === 'adm123') {
        // Redirecionar para a área administrativa (vamos implementar isso mais tarde)
        window.location.href = 'html/admin.html'; 
    } else {
        alert('Senha incorreta!');
    }
}
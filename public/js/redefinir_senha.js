// redefinir_senha.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {

                // Verifica se o usuário logado é o Matheus (ID 1)
                const administradorId = parseInt(localStorage.getItem('administrador'));
                if (administradorId === 1) {
                    document.getElementById('form-redefinir-senha').addEventListener('submit', redefinirSenha);
                } else {
                    alert('Você não tem permissão para acessar esta página.');
                    window.location.href = 'funcionarios.html'; // Redireciona para a página de funcionários
                }
            }
        });
});

function redefinirSenha(event) {
    event.preventDefault();

    const administradorId = parseInt(document.getElementById('administrador-id').value);
    const novaSenha = document.getElementById('nova-senha').value.trim();
    const confirmarSenha = document.getElementById('confirmar-nova-senha').value.trim();

    if (isNaN(administradorId) || administradorId <= 0 || novaSenha === '' || confirmarSenha === '') {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert('As novas senhas não coincidem!');
        return;
    }

    fetch(`/api/administradores/${administradorId}/redefinir-senha`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            novaSenha
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao redefinir senha.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        // Limpa os campos de senha
        document.getElementById('administrador-id').value = '';
        document.getElementById('nova-senha').value = '';
        document.getElementById('confirmar-nova-senha').value = '';
    })
    .catch(error => {
        alert('Erro ao redefinir senha.');
        console.error(error);
    });
}

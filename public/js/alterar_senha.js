// alterar_senha.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                document.getElementById('form-alterar-senha').addEventListener('submit', alterarSenha);
            }
        });
});
function alterarSenha(event) {
    event.preventDefault();

    const administradorId = parseInt(localStorage.getItem('administrador'));
    const senhaAtual = document.getElementById('senha-atual').value.trim();
    const novaSenha = document.getElementById('nova-senha').value.trim();
    const confirmarSenha = document.getElementById('confirmar-nova-senha').value.trim();

    if (senhaAtual === '' || novaSenha === '' || confirmarSenha === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert('As novas senhas não coincidem!');
        return;
    }

    fetch(`/api/administradores/${administradorId}/senha`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            senhaAtual,
            novaSenha
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao alterar senha.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        // Limpa os campos de senha
        document.getElementById('senha-atual').value = '';
        document.getElementById('nova-senha').value = '';
        document.getElementById('confirmar-nova-senha').value = '';
    })
    .catch(error => {
        alert('Erro ao alterar senha.');
        console.error(error);
    });
}
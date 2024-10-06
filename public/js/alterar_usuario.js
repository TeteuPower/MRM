// alterar_usuario.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                exibirUsuarioAtual();

                document.getElementById('form-alterar-usuario').addEventListener('submit', alterarUsuario);
            }
        });
});

function exibirUsuarioAtual() {
    const administradorId = parseInt(localStorage.getItem('administrador'));

    fetch(`/api/administradores/${administradorId}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar administrador.');
        }
        return response.json();
    })
    .then(administrador => {
        document.getElementById('nome-usuario-atual').textContent = administrador.usuario;
    })
    .catch(error => {
        alert('Erro ao buscar administrador.');
        console.error(error);
    });
}

function alterarUsuario(event) {
    event.preventDefault();

    const administradorId = parseInt(localStorage.getItem('administrador'));
    const novoUsuario = document.getElementById('novo-usuario').value.trim();
    const confirmarNovoUsuario = document.getElementById('confirmar-novo-usuario').value.trim();

    if (novoUsuario === '' || confirmarNovoUsuario === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (novoUsuario !== confirmarNovoUsuario) {
        alert('Os novos usuários não coincidem!');
        return;
    }

    fetch(`/api/administradores/${administradorId}/usuario`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ novoUsuario })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao alterar usuário.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        // Limpa os campos de usuário
        document.getElementById('novo-usuario').value = '';
        document.getElementById('confirmar-novo-usuario').value = '';
        exibirUsuarioAtual();
    })
    .catch(error => {
        alert('Erro ao alterar usuário.');
        console.error(error);
    });
}
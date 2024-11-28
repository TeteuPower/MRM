// novo_usuario.js (frontend)

document.addEventListener('DOMContentLoaded', function() {
    /*verificarAutenticacao()
        .then(autenticado => {
            if (autenticado) {
                document.querySelector('btn mt-4').addEventListener('click', cadastrarUsuario);
            }
        });*/
});

function cadastrarUsuario(event) {
    //event.preventDefault();

    const nome = document.getElementById('logname').value.trim();
    const email = document.getElementById('new-logemail').value.trim();
    const senha = document.getElementById('new-logpass').value.trim();
    const confirmaSenha = document.getElementById('confirm-new-logpass').value.trim();
    const usuario = document.getElementById('new-logemail').value.trim(); //Email é o usuário por enquanto
    //const revendedor = document.getElementById('revendedor').checked; // Obtém o valor do checkbox

    if (nome === '' || email === '' || senha === '' || usuario === '' || confirmaSenha === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (senha !== confirmaSenha) {
        alert('As senhas nao coincidem!');
        return;
    }

    fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ nome, email, usuario, senha })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        // Limpa o formulário
        document.getElementById('logname').value = '';
        document.getElementById('new-logemail').value = '';
        document.getElementById('new-logpass').value = '';
        document.getElementById('confirm-new-logpass').value = '';
        const checkbox = document.getElementById('reg-log');
        checkbox.checked = !checkbox.checked; // Inverte o estado atual do checkbox
    })
    .catch(error => {
        alert('Erro ao cadastrar usuário.');
        console.error(error);
    });
}
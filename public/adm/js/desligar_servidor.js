// desligar_servidor.js

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();

    // Adicione um event listener ao botão "Desligar Servidor"
    document.getElementById('btn-desligar-servidor').addEventListener('click', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        const senha = document.getElementById('senha-desligamento').value;

        // Valida a senha
        if (senha !== 'adm123') { // Substitua 'senha-do-servidor' pela senha correta
            alert('Senha incorreta!');
            return;
        }

        // Confirma a ação
        if (confirm('Tem certeza que deseja desligar o servidor?')) {
            // Faz uma requisição GET para a rota /shutdown
            fetch('/shutdown', {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao desligar o servidor.');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                // Redireciona para a página de login ou qualquer outra página desejada
                // window.location.href = '/login';
            })
            .catch(error => {
                alert('Erro ao desligar o servidor.');
                console.error(error);
            });
        }
    });
});
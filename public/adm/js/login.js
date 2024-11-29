/*document.getElementById('adminBtn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('adminModal').style.display = 'none';
});*/

document.addEventListener('DOMContentLoaded', function () {
    //exibirLogin();
    jaEstaLogado();
});

function jaEstaLogado() {
    const token = localStorage.getItem('token');
    const admId = localStorage.getItem('administrador');

    if (token) {
        if (admId === '1') {
            window.location.href = '/adm/consultar_pedidos';
        } else {
            window.location.href = '/adm/pagina_inicial';
        }
    }
}

function checkAdminPassword() {
    const adminPassword = document.getElementById('logpass').value;
    const adminUsuario = document.getElementById('logemail').value;

    // Verifica se o usuário é um administrador (contém "(adm.)" no início)
    const ehAdministrador = adminUsuario.startsWith('adm.');
    //console.log(ehAdministrador);

    // Define a rota de login com base no tipo de usuário
    const rotaLogin = ehAdministrador ? '/api/login-admin' : '/api/login-user';
    const rotaToken = ehAdministrador ? '/api/decodificar-token' : '/api/decodificar-token-user'

    // Faz uma requisição POST para a rota de login para obter o token
    fetch(rotaLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            senha: adminPassword,
            usuario: ehAdministrador ? adminUsuario.substring(4).trim() : adminUsuario // Remove o prefixo "(adm.)" e remove espacos em branco
         })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Senha incorreta.');
        }
        return response.json();
    })
    .then(data => {
        //console.log(data);
        const token = data.token;

        if (!ehAdministrador) {
            localStorage.setItem('Usuario', data.nome);
            localStorage.setItem('tokenUser', token);
        } else {
        // Armazena o token no Local Storage
            localStorage.setItem('token', token);
        }

        // Faz uma requisição à API para decodificar o token
        fetch(rotaToken, {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao decodificar o token.');
            }
            return response.json();
        })
        .then(data => {
            if (ehAdministrador) {
                const adminId = data.id; // Obtém o ID do administrador da resposta

                // Faz uma requisição à API de administradores com o ID e o token
                fetch(`/api/administradores/${adminId}`, {
                    headers: {
                        'Authorization': token
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados do administrador.');
                    }
                    return response.json();
                })
                .then(administrador => {
                    // Define a chave "administrador" no Local Storage
                    localStorage.setItem('administrador', administrador.id);
                    localStorage.setItem('administradorNome', administrador.nome);

                    if (administrador.id === 1) {
                        window.location.href = '/adm/consultar_pedidos';
                    } else {
                        window.location.href = '/adm/pagina_inicial';
                    }

                    // Exibe o alerta de boas-vindas
                    alert(`Seja bem vindo, ${administrador.nome}!`);
                })
                .catch(error => {
                    // Erro na requisição ou ao buscar dados do administrador
                    alert('Erro ao fazer login.');
                    console.error(error);
                });
            } else {
            console.log(data);
            alert('Seja bem vindo usuário!');
            }
        })
        .catch(error => {
            // Erro ao decodificar o token
            alert('Erro ao decodificar o token.');
            console.error(error);
        });
    })
    .catch(error => {
        // Senha incorreta
        alert(error.message); 
    });
}

function exibirLogin() {
    // Verifica se estamos na página de login
    const isLoginPage = window.location.pathname === '/adm' || window.location.pathname === '/'; 

    if (isLoginPage) {
        // Se estiver na página de login, exibe o conteúdo
        document.body.classList.add('visivel');
        return Promise.resolve(true); // Retorna uma promessa resolvida para evitar erros nas páginas protegidas
    }
}
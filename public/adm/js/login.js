document.addEventListener('DOMContentLoaded', function() {
    //exibirLogin();
    jaEstaLogado();
    const entrarSpan = document.getElementById('entrarSpan');
    const cadastrarSpan = document.getElementById('cadastrarSpan');
  
    if (entrarSpan) {
      entrarSpan.addEventListener('click', function() {
        const checkbox = document.getElementById('reg-log');
        checkbox.checked = !checkbox.checked;
      });
    }

    if (cadastrarSpan) {
      cadastrarSpan.addEventListener('click', function() {
        const checkbox = document.getElementById('reg-log');
        checkbox.checked = !checkbox.checked;
      });
    }

    const recuperarSenha = document.getElementById('esqueceu-senha');
    recuperarSenha.addEventListener('click', function(event) {
        event.preventDefault();
        esqueceuSenha();
    });

  });

function jaEstaLogado() {
    const token = localStorage.getItem('token');
    const admId = localStorage.getItem('administrador');
    const tokenUser = localStorage.getItem('tokenUser');
    const tokenRevendedor = localStorage.getItem('tokenRevendedor');
    const tokenEntregador = localStorage.getItem('tokenEntregador');

    if (token && tokenUser) {
        alert('Você está logado com a conta de administrador e de cliente, será deslogada as duas contas');
        //remove token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('tokenUser');
        localStorage.removeItem('administrador');
        localStorage.removeItem('administradorNome');
    }

    if (token) {
        if (admId === '1') {
            alert('Você está logado como administrador!');
            window.location.href = '/adm/consultar_pedidos';
        } else {
            alert('Você está logado como administrador!');
            window.location.href = '/adm/pagina_inicial';
        }
    }

    if (tokenUser) {
        alert('Você está logado!');
        window.location.href = '/menu';
    }

    if (tokenRevendedor) {
        alert('Você está logado como revendedor!');
        window.location.href = '/rev/pagina_inicial';
    }

    if (tokenEntregador) {
        alert('Você está logado como entregador!');
        window.location.href = '/entregador/pagina_inicial';
    }
}

function checkAdminPassword() {
    const adminPassword = document.getElementById('logpass').value;
    const adminUsuario = document.getElementById('logemail').value;

    // Verifica se o usuário é um administrador (contém "adm." no início)
    const ehAdministrador = adminUsuario.startsWith('adm.');
    // Verifica se o acesso é para revendedores
    const ehRevendedor = adminUsuario.startsWith('rev.');
    // Verifica se o acesso é para envios
    const ehEnvio = adminUsuario.startsWith('env.');

    // Define a rota de login com base no tipo de usuário
    const rotaLogin = ehAdministrador ? '/api/login-admin'
                      : ehRevendedor ? '/api/login-revendedor'
                      : ehEnvio ? '/api/login-envios' // <-- Rota para Envios
                      : '/api/login-user'; // <-- Usuário comum como padrão

    const rotaToken = ehAdministrador ? '/api/decodificar-token'
                      : ehRevendedor ? '/api/decodificar-token-revendedor'
                      : ehEnvio ? '/api/decodificar-token-envios' // <-- Rota de token para Envios
                      : '/api/decodificar-token-user'; // <-- Token de usuário comum como padrão

    // Faz uma requisição POST para a rota de login para obter o token
    fetch(rotaLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            senha: adminPassword,
            // Remove o prefixo ("adm.", "rev." ou "env.") e remove espaços em branco
            usuario: ehAdministrador ? adminUsuario.substring(4).trim()
                     : ehRevendedor ? adminUsuario.substring(4).trim()
                     : ehEnvio ? adminUsuario.substring(4).trim() // <-- Tratamento para Envios
                     : adminUsuario // <-- Usuário comum não tem prefixo
         })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao fazer login.');
            });
        }
        return response.json();
    })
    .then(data => {
        //console.log(data);
        const token = data.token;

        if (!ehAdministrador && !ehRevendedor && !ehEnvio) {
            localStorage.setItem('Usuario', data.nome);
            localStorage.setItem('tokenUser', token);
        }

        if (ehAdministrador) {
        // Armazena o token no Local Storage
            localStorage.setItem('token', token);
        }

        if (ehRevendedor) {
            localStorage.setItem('tokenRevendedor', token);
        }

        if (ehEnvio) {
            localStorage.setItem('tokenEntregador', token);
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
            }
            
            if (ehRevendedor) {
                const revendedorId = data.id; // Obtém o ID do revendedor da resposta

                // Faz uma requisição à API de revendedores com o ID e o token
                fetch(`/api/revendedores/${revendedorId}`, {
                    headers: {
                        'Authorization': token
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados do revendedor.');
                    }
                    return response.json();
                })
                .then(revendedor => {
                    // Define a chave "revendedor" no Local Storage
                    localStorage.setItem('revendedor', revendedor.id);
                    localStorage.setItem('revendedorNome', revendedor.nome);

                    // Exibe o alerta de boas-vindas
                    alert(`Seja bem vindo, ${revendedor.nome}!`);
                    window.location.href = '/rev/pagina_inicial'
                })
                .catch(error => {
                    // Erro na requisição ou ao buscar dados do revendedor
                    alert('Erro ao fazer login.');
                    console.error(error);
                });
            }

            if (ehEnvio) {
                const envioId = data.id; // Obtém o ID do envio da resposta

                // Faz uma requisição à API de envios com o ID e o token
                fetch(`/api/envios/${envioId}`, {
                    headers: {
                        'Authorization': token
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados do envio.');
                    }
                    return response.json();
                })
                .then(entregador => {
                    // Define a chave "entregador" no Local Storage
                    localStorage.setItem('entregador', entregador.id);
                    localStorage.setItem('entregadorNome', entregador.nome);

                    // Exibe o alerta de boas-vindas
                    alert(`Seja bem vindo, ${entregador.nome}!`);
                    window.location.href = '/entregador/pagina_inicial'
                })
                .catch(error => {
                    // Erro na requisição ou ao buscar dados do envio
                    alert('Erro ao fazer login.');
                    console.error(error);
                });
            }

            if (!ehAdministrador && !ehRevendedor && !ehEnvio) {
            const nome = localStorage.getItem('Usuario');
            alert(`Bem vindo(a) ${nome}!`);
            window.location.href = '/menu';
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
        //console.log('aaaaa')
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

// Esqueceu senha
function esqueceuSenha() {
    const email = document.getElementById('logemail').value;
    if (!email) {
        alert('Preencha o e-mail que deseja recuperar a senha.');
        return;
    }

    fetch('/api/usuarios/redefinir-senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar e-mail de redefinição de senha.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        alert('Erro ao enviar e-mail de redefinição de senha.');
    });
}
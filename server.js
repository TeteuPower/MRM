const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { db } = require('./db'); // Importa o módulo de conexão com o banco de dados
const app = express();
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken
const request = require('request')
const autenticar = require('./middleware/auth'); // Importa o middleware de autenticação
const autenticarClientes = require('./middleware/authClientes'); // Importas o middleware de autenticação
const bcrypt = require('bcrypt'); // Importa o módulo bcrypt
require('dotenv').config(); // Carrega as variáveis do .env

// Definir o fuso horário
process.env.TZ = 'America/Sao_Paulo';

// Rota para obter a hora do servidor
app.get('/api/hora-servidor', (req, res) => {
    const hora = new Date().toLocaleString(); // Obtém a hora do servidor no formato local
    res.json({ hora });
});


// Middleware para processar o corpo das requisições POST
app.use(bodyParser.json()); 

// Define as pastas 'html', 'css' e 'js' como pastas de arquivos estáticos
app.use('/html', express.static(path.join(__dirname, 'public', 'adm', 'html'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/html');
    }
}));
app.use('/html', express.static(path.join(__dirname, 'public', 'cliente', 'html'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/html');
    }
}));
app.use('/css', express.static(path.join(__dirname, 'public', 'adm', 'css'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/css');
    }
}));
app.use('/css', express.static(path.join(__dirname, 'public', 'cliente', 'css'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/css');
    }
}));
app.use('/js', express.static(path.join(__dirname, 'public', 'adm', 'js'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/javascript');
    }
}));
app.use('/js', express.static(path.join(__dirname, 'public', 'cliente', 'js'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/javascript');
    }
}));
app.use('/statics', express.static(path.join(__dirname, 'statics')));
app.use('/img', express.static(path.join(__dirname, 'public', 'cliente', 'img')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'cliente', 'assets')));

// Define a rota para a página de login (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente', 'html', 'index.html'));
});

// Define a rota para a página de login (index.html)
app.get('/adm', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'index.html'));
});

// Define a rota para a página inicial (pagina_inicial.html)
app.get('/adm/pagina_inicial', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'pagina_inicial.html'));
});

// Define a rota para o header (header.html)
app.get('/adm/header.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'header.html'));
});

// Define a rota para nova_venda (nova_venda.html)
app.get('/adm/nova_venda', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'nova_venda.html'));
});

// Defina a rota para consultar_clientes (consultar_clientes.html)
app.get('/adm/consultar_cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'consultar_cliente.html'));
});

// Define a rota para novo_cliente (novo_cliente.html)
app.get('/adm/novo_cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'novo_cliente.html'));
});

// Define a rota para pagamentos (pagamentos.html)
app.get('/adm/pagamentos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'pagamentos.html'));
});

// Define a rota para gastos (gastos.html)
app.get('/adm/gastos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'gastos.html'));
});

//Define a rota para pagamentos (financeiro.html)
app.get('/adm/financeiro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'financeiro.html'));
});

//Define a rota para divisao_lucros_producao (divisao_lucros_producao.html)
app.get('/adm/divisao_lucros_producao', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'divisao_lucros_producao.html'));
});

// Define a rota para divisao_lucros_empresa (divisao_lucros_empresa.html)
app.get('/adm/divisao_lucros_empresa', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'divisao_lucros_empresa.html'));
});

//Define a rota para divisao_lucros_vendedores (divisao_lucros_vendedores.html)
app.get('/adm/divisao_lucros_vendedores', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'divisao_lucros_vendedores.html'));
});

//Define a rota para financeiro (financeiro.html)
app.get('/adm/financeiro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'financeiro.html'));
});

//Define a rota para financas (financas.html)
app.get('/adm/financas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'financas.html'));
});

//Define a rota para consultar_pedidos (consultar_pedidos.html)
app.get('/adm/consultar_pedidos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'consultar_pedidos.html'));
});

// Define a rota para alterar_senha (alterar_senha.html)
app.get('/adm/alterar_senha', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'alterar_senha.html'));
});

//Define a rota para alterar_usuario (alterar_usuario.html)
app.get('/adm/alterar_usuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'alterar_usuario.html'));
});

//Define a rota para funcionarios (funcionarios.html)
app.get('/adm/funcionarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'funcionarios.html'));
});

//Define a rota para redefinir_senha (redefinir_senha.html)
app.get('/adm/redefinir_senha', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'redefinir_senha.html'));
});

//Define a rota para estoque (estoque.html)
app.get('/adm/estoque', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'estoque.html'));
});

//Define a rota para desligar_servidor
app.get('/adm/desligar_servidor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adm', 'html', 'desligar_servidor.html'));
});

//Define a rota para menu do usuário
app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente', 'html', 'menu.html'));
});



module.exports = {
    app: app // Exporta também o app do express
};
///////////////////////API'S///////////////////////////////////

//API teste
app.get('/teste', (req, res) => {
    res.json({ message: 'Tudo ok por aqui!'})
})

// Todas as rotas dentro do administradores.js estarão disponíveis em /api/administradores se tiverem a autentificação do token
app.use('/api/administradores', autenticar, require('./routes/administradores'));
// Rotas clientes
app.use('/api/clientes', autenticar, require('./routes/clientes'));
//Rotas estoque
app.use('/api/estoque', autenticar, require('./routes/estoque'));
// Usa a rota de vendedores
app.use('/api/funcionarios', autenticar, require('./routes/funcionarios'));
// Usa a rota de pedidos
app.use('/api/pedidos', autenticar, require('./routes/pedidos'));
// Usa a rota de pedidos aguardando produção
app.use('/api/pedidos-aguardando-producao', autenticar, require('./routes/pedidos-aguardando-producao'));
// Usa a rota de pedidos aguardando envio
app.use('/api/pedidos-finalizados-aguardando-envio', autenticar, require('./routes/pedidos-finalizados-aguardando-envio'));
// Usa a rota de pedidos finalizados
app.use('/api/pedidos-finalizados', autenticar, require('./routes/pedidos-finalizados'));
// Usa a rota de pagamentos
app.use('/api/pagamentos', autenticar, require('./routes/pagamentos'));
// Usa a rota de gastos
app.use('/api/gastos', autenticar, require('./routes/gastos'));
// Usa a rota de financeiro
app.use('/api/financeiro', autenticar, require('./routes/financeiro'));
// Usa a rota de divisão de lucros
app.use('/api/divisao-lucros', autenticar, require('./routes/divisao_lucros'));
// Usa a rota de divisão de lucros simplificada
app.use('/api/divisao-lucros-simples', autenticar, require('./routes/divisao_lucros_simples'));
// Usa a rota para clientes sem token
app.use('/api/produtos', require('./routes/cliente/produtos'));
// Usa a rota para clientes sem token
app.use('/api/usuarios', require('./routes/cliente/usuarios'));
// Usa a rota para enviar emails
app.use('/api/mail', require('./src/controllers/mail'));


// Rota para login do administrador (gera o token)
app.post('/api/login-admin', (req, res) => {
    const { usuario, senha } = req.body; // Recebe usuário e senha

    const sql = `SELECT * FROM administradores WHERE usuario = ?`; // Busca por usuário
    db.query(sql, [usuario], async (err, results) => {
        if (err) {
            console.error('Erro ao verificar o usuário:', err);
            return res.status(500).json({ error: 'Erro ao verificar o usuário.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado.' }); 
        }

        const administrador = results[0];

        try {
            // Compara a senha fornecida com o hash armazenado
            const senhaValida = await bcrypt.compare(senha, administrador.senha); 

            if (senhaValida) {
                const token = jwt.sign({ id: administrador.id }, process.env.JWT_SECRET_ADMIN, { expiresIn: '24h' });
                return res.json({ token, id: administrador.id, nome: administrador.nome, usuario: administrador.usuario });
            } else {
                return res.status(401).json({ error: 'Senha incorreta.' });
            }
        } catch (err) {
            console.error('Erro ao comparar senhas:', err);
            return res.status(500).json({ error: 'Erro ao verificar a senha.' });
        }
    });
});

// Rota para login do usuário (gera o token)
app.post('/api/login-user', (req, res) => {
    const { usuario, senha } = req.body;

    const sql = `SELECT * FROM usuarios WHERE usuario = ?`;
    db.query(sql, [usuario], async (err, results) => {
        if (err) {
            console.error('Erro ao verificar o usuário:', err);
            return res.status(500).json({ error: 'Erro ao verificar o usuário.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        const usuarioDb = results[0];

        try {
            const senhaValida = await bcrypt.compare(senha, usuarioDb.senha);

            if (senhaValida) {
                const token = jwt.sign({ id: usuarioDb.id }, process.env.JWT_SECRET_USER, { expiresIn: '24h' });
                return res.json({ token, id: usuarioDb.id, nome: usuarioDb.nome, usuario: usuarioDb.usuario });
            } else {
                return res.status(401).json({ error: 'Senha incorreta.' });
            }
        } catch (err) {
            console.error('Erro ao comparar senhas:', err);
            return res.status(500).json({ error: 'Erro ao verificar a senha.' });
        }
    });
});

// Rota para decodificar o token JWT
app.get('/api/decodificar-token', autenticar, (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
        res.json({ id: decoded.id }); // Envia o ID do administrador como resposta
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
});

// Rota para decodificar o token JWT
app.get('/api/decodificar-token-user', autenticarClientes, (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        res.json({ id: decoded.id }); // Envia o ID do administrador como resposta
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
});

// Rota para verificar a validade do token JWT
app.get('/api/verificar-token', autenticar, (req, res) => {
    // Se o middleware autenticar for bem-sucedido, o token é válido
    res.json({ valido: true });
});

// Rota para verificar a validade do token JWT
app.get('/api/verificar-token-user', autenticarClientes, (req, res) => {
    // Se o middleware autenticar for bem-sucedido, o token é válido
    res.json({ valido: true });
});

// Rota para desligar o servidor
app.get('/shutdown', autenticar, (req, res) => {
    console.log('Desligando o servidor...');
    res.send('Desligando o servidor...');
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

// API para converter dólar para real
app.get('/api/converter-dolar-real', (req, res) => {
    const options = {
        url: 'https://economia.awesomeapi.com.br/last/USD-BRL',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, (err, response, body) => {
        if (err) {
            console.error('Erro ao consultar API de conversão:', err);
            res.status(500).json({ error: 'Erro ao consultar API de conversão.' });
            return;
        }

        try {
            const json = JSON.parse(body);
            const cotacao = parseFloat(json.USDBRL.bid); // Obtém a cotação de compra do dólar
            res.json({ cotacao });
        } catch (error) {
            console.error('Erro ao analisar resposta da API:', error);
            res.status(500).json({ error: 'Erro ao consultar API de conversão.' });
        }
    });
});

// API para converter real para dolar
app.get('/api/converter-real-dolar', (req, res) => {
    const options = {
        url: 'https://economia.awesomeapi.com.br/last/BRL-USD',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, (err, response, body) => {
        if (err) {
            console.error('Erro ao consultar API de conversão:', err);
            res.status(500).json({ error: 'Erro ao consultar API de conversão.' });
            return;
        }

        try {
            const json = JSON.parse(body);
            const cotacao = parseFloat(json.BRLUSD.bid); // Obtém a cotação de compra do dólar
            res.json({ cotacao });
        } catch (error) {
            console.error('Erro ao analisar resposta da API:', error);
            res.status(500).json({ error: 'Erro ao consultar API de conversão.' });
        }
    });
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        // Lógica para tentar se reconectar
        process.exit(1); // Encerra o aplicativo em caso de erro de conexão
    } else {
        console.log('Conexão com o banco de dados estabelecida.');
        connection.release(); // Libera a conexão de volta para o pool

        // Inicia o servidor somente após a conexão bem-sucedida
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor em execução na porta ${PORT}`);
        });
    }
});
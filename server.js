const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db'); // Importa o módulo de conexão com o banco de dados
const app = express();
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken
const request = require('request')
const autenticar = require('./middleware/auth'); // Importa o middleware de autenticação
const bcrypt = require('bcrypt'); // Importa o módulo bcrypt
require('dotenv').config(); // Carrega as variáveis do .env

// Middleware para processar o corpo das requisições POST
app.use(bodyParser.json()); 

// Define as pastas 'html', 'css' e 'js' como pastas de arquivos estáticos
app.use('/html', express.static(path.join(__dirname, 'public', 'html'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/html');
    }
}));
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/css');
    }
}));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), {
    setHeaders: function (res, path, stat) {
        res.setHeader('Content-Type', 'text/javascript');
    }
}));
app.use('/statics', express.static(path.join(__dirname, 'statics')));

// Define a rota para a página de login (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
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


// Rota para login do administrador (gera o token)
app.post('/api/login', (req, res) => {
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
                const token = jwt.sign({ id: administrador.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
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

// Rota para decodificar o token JWT
app.get('/api/decodificar-token', autenticar, (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}`);
});
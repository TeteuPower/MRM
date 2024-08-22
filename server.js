const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser'); // Importa o body-parser
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env

const DATABASE_URL = process.env.DATABASE_URL;
const connection = mysql.createConnection(DATABASE_URL);

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

const app = express();
const db = require('./server'); // Importa o módulo de conexão com o banco de dados

// Define as pastas 'html', 'css' e 'js' como pastas de arquivos estáticos
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Define a rota para a página de login (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Middleware para processar o corpo das requisições POST
app.use(bodyParser.json()); 

// API para verificar a senha do administrador
app.get('/verificar-senha-admin', (req, res) => {
    const senha = req.query.senha; // Obtém a senha da query string

    const sql = `SELECT * FROM administradores WHERE senha = ?`;
    connection.query(sql, [senha], (err, results) => {
        if (err) {
            console.error('Erro ao verificar a senha:', err);
            res.status(500).json({ error: 'Erro ao verificar a senha.' });
            return;
        }

        if (results.length > 0) {
            // Senha correta!
            const administrador = results[0].nome;
            res.json({ administrador }); // Envia o nome do administrador como resposta
        } else {
            // Senha incorreta
            res.status(401).json({ error: 'Senha incorreta.' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}`);
});

module.exports = {
    db: connection,
    app: app // Exporta também o app do express
};

// db.js

// ... (seu código existente para conectar ao banco de dados) ...

// Função global para executar consultas SQL
if (typeof window !== 'undefined') {
    // Função global para executar consultas SQL no navegador
    window.executarConsultaSQL = function(sql, params, callback) {
        connection.query(sql, params, callback);
    };
}

// ... (seu código existente) ...
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

// Rota para autenticar administradores
app.post('/login', (req, res) => {
    const senha = req.body.senha; // Recebe apenas a senha do formulário

    // Consulta SQL para verificar a senha (sem verificar o nome)
    const sql = `SELECT * FROM administradores WHERE senha = ?`; 

    db.db.query(sql, [senha], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            res.status(500).json({ error: 'Erro ao verificar a senha.' });
            return;
        }

        if (results.length > 0) {
            // Administrador encontrado
            res.json({ success: true, administrador: results[0] });
        } else {
            // Senha incorreta
            res.json({ success: false });
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
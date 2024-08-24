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

//////////////////////////////MÓDULOS///////////////////////////////////////////////////////

const app = express();
const db = require('./server'); // Importa o módulo de conexão com o banco de dados

//////////////ROTAS ESTÁTICAS/////////////////////////

// Define as pastas 'html', 'css' e 'js' como pastas de arquivos estáticos
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

//////////////ROTA PÁGINA INICIAL//////////////////////

// Define a rota para a página de login (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

///////////////////////////////////////////////////////////
// Middleware para processar o corpo das requisições POST
app.use(bodyParser.json()); 

module.exports = {
    db: connection,
    app: app // Exporta também o app do express
};
///////////////////////API'S///////////////////////////////////

// API para executar consultas SQL
app.get('/consulta', (req, res) => {
    const sql = req.query.sql; // Obtém a consulta SQL da query string
    const params = JSON.parse(req.query.params || '[]'); // Obtém os parâmetros da query string (opcional)

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao executar a consulta.' });
            return;
        }

        res.json(results); // Envia os resultados da consulta como resposta
    });
});


app.get('/api/administradores', (req, res) => {
    const sql = 'SELECT * FROM administradores';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar administradores:', err);
            res.status(500).json({ error: 'Erro ao buscar administradores.' });
            return;
        }
        res.json(results);
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}`);
});

//////////////////////////FUNÇÕES GLOBAIS///////////////////////////////////

// Função global para executar consultas SQL
if (typeof window !== 'undefined') {
    // Função global para executar consultas SQL no navegador
    window.executarConsultaSQL = function(sql, params, callback) {
        connection.query(sql, params, callback);
    };
}

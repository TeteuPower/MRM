const express = require('express');
const mysql = require('mysql');
const url = require('url'); // Importe a biblioteca url
const app = express();
const port = process.env.PORT || 3000;

// Analisa a URL do banco de dados
const dbUrl = process.env.DATABASE_URL;
const parsedDbUrl = url.parse(dbUrl);

// Configuração da conexão com o MySQL usando DATABASE_URL
const connection = mysql.createConnection({
    host: parsedDbUrl.hostname,
    user: parsedDbUrl.auth.split(':')[0], // Extrai o usuário da URL
    password: parsedDbUrl.auth.split(':')[1], // Extrai a senha da URL
    database: parsedDbUrl.pathname.substring(1), // Extrai o nome do banco de dados da URL
    port: parsedDbUrl.port // Extrai a porta da URL
});

// Testa a conexão
connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao MySQL:TETE', error);
    } else {
        console.log('Conexão com o MySQL estabelecida com sucesso!TETE');
    }
});

// Rotas da sua API (exemplo: /clientes)
// ... adicione suas rotas aqui, como no exemplo anterior ...

app.listen(port, () => {
    console.log(`TETEServidor rodando na porta ${port}`);
});
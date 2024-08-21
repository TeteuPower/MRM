const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

// Configuração da conexão com o MySQL usando variáveis de ambiente
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT // Adicione a porta do MySQL
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
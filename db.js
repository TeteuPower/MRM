// db.js

const mysql = require('mysql2');

// Variáveis de conexão fornecidas pelo Railway
const host = process.env.DATABASE_HOST;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

// Conecte-se ao banco de dados
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Exporte a conexão para ser usada em outros arquivos
module.exports = connection;
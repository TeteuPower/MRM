const mysql = require('mysql2');

// Obtém a URL de conexão do banco de dados do ambiente
const DATABASE_URL = process.env.DATABASE_URL;

// Cria a conexão com o banco de dados
const connection = mysql.createConnection(DATABASE_URL);

// Conecta ao banco de dados
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Exporta a conexão para ser usada em outros arquivos
module.exports = connection;
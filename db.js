// db.js
const mysql = require('mysql');

// Configuração da conexão com o MySQL usando DATABASE_URL
const connection = mysql.createConnection(process.env.DATABASE_URL);

// Testa a conexão
connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao MySQL:TE', error);
    } else {
        console.log('Conexão com o MySQL estabelecida com sucesso!TE');
    }
});

// Exporta a conexão para ser usada em outros arquivos
module.exports = connection;
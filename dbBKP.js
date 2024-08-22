const mysql = require('mysql2');
const http = require('http');

const DATABASE_URL = process.env.DATABASE_URL;
const connection = mysql.createConnection(DATABASE_URL);

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor Node.js em execução!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}`);
});
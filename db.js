const mysql = require('mysql2');
const express = require('express');
const path = require('path');

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

// Define as pastas 'html', 'css' e 'js' como pastas de arquivos estáticos
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Define a rota para a página de login (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html')); // Mova o index.html para a pasta 'html'
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}`);
});
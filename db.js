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
const db = require('./db'); // Importa o módulo de conexão com o banco de dados

// Define as pastas 'html', 'css' e 'js' como pastas de arquivos estáticos
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Define a rota para a página de login (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Rota para autenticar administradores
app.post('/login', (req, res) => {
    const nome = req.body.nome;
    const senha = req.body.senha;

    const sql = `SELECT * FROM administradores WHERE nome = ? AND senha = ?`;
    db.db.query(sql, [nome, senha], (err, results) => {
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
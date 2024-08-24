const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db'); // Importa o módulo de conexão com o banco de dados
const app = express();
require('dotenv').config(); // Carrega as variáveis do .env

// Middleware para processar o corpo das requisições POST
app.use(bodyParser.json()); 

// Define as pastas 'html', 'css' e 'js' como pastas de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/statics', express.static(path.join(__dirname, 'statics')));

// Define a rota para a página de login (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

module.exports = {
    app: app // Exporta também o app do express
};
///////////////////////API'S///////////////////////////////////

// Usa a rota de administradores
app.use('/api/administradores', require('./routes/administradores'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}`);
});

//////////////////////////FUNÇÕES GLOBAIS///////////////////////////////////
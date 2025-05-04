const jwt = require('jsonwebtoken');

//Autentica clientes
function autenticarEnvio(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    try {
        // Obtém a chave secreta da variável de ambiente JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ENVIOS);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
}

module.exports = autenticarEnvio;
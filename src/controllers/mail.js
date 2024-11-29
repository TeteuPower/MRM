const send = require("../services/nodemailer");
const fs = require('fs'); // Importe o módulo fs (sem promises)
const path = require('path');

const sendMail = (req, res) => {
    const { email } = req.body;

    const subject = 'Espírito Do Nativo';
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'mail_models', 'confirmar_email.html'), 'utf-8');

    send(email, subject, html);

    return res.json('Email enviado com sucesso!');
}

module.exports = sendMail;
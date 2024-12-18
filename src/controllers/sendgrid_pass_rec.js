const sendGrid = require("../services/sendgrid");
const fs = require('fs');
const path = require('path');
const validator = require('validator');

const emailTemplatePath = path.join(__dirname, '..', '..', 'public', 'mail_models', 'recuperar_senha.html');
let emailTemplate; // Variável para armazenar o template

try {
    emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
} catch (error) {
    console.error("Erro ao ler o template de email:", error);
    // Template padrão de erro
    //emailTemplate = "<h1>Erro ao carregar o template de email</h1><p>Por favor, tente novamente mais tarde.</p>";
    // Ou:
    throw new Error("Erro ao ler o template de email"); 
}

const sendMail = async (req, res) => {
    const { email, token } = req.body;

    const apiUrl = process.env.API_URL;

    const confirmationLink = `${apiUrl}/recuperar-senha?token=${token}`;
    const html = emailTemplate.replaceAll('{{confirmationLink}}', confirmationLink); // Substitui o placeholder

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Endereço de email inválido.' });
    }

    const subject = 'Espírito Do Nativo';

    try {
        await sendGrid(email, subject, html);
        console.log(`Email de recuperação de senha enviado para ${email}`);
        return res.status(200).json({ message: 'Email de confirmação enviado com sucesso!' }); // status 200 para sucesso.
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return res.status(500).json({ message: 'Erro ao enviar email. Por favor, tente novamente mais tarde.' });
    }
};

module.exports = sendMail;
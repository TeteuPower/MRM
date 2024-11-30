const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGrid = (to, subject, html) => {
    sgMail.send({
        from: process.env.SENDGRID_API_FROM,
        to,
        subject,
        html
    })
    .then(() => {
        //console.log('Email enviado com sucesso!');
    })
    .catch((error) => {
        console.error('Erro ao enviar o email:', error);
    });
}

module.exports = sendGrid;
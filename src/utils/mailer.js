const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 2525,
    secure: false, // true sólo si usas TLS
    auth: {
        user: 'apikey',
        pass: 'xnqh zfdx eaba tsxn'
    }
});

//process.env.FROM_EMAIL

exports.sendRecoveryEmail = async (toEmail, recoveryCode) => {
    const mailOptions = {
        from: "oscarmontano222@gmail.com", 
        to: toEmail,
        subject: 'Recuperación de Contraseña',
        text: `Tu código de recuperación es: ${recoveryCode}. Este código es válido por 15 minutos.`
    };

    return transporter.sendMail(mailOptions);
};
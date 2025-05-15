const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'oscarmontano222@gmail.com',
        pass: 'xnqh zfdx eaba tsxn'
    }
});

exports.sendRecoveryEmail = async (toEmail, recoveryCode) => {
    const mailOptions = {
        from: 'oscarmontano222@gmail.com',
        to: toEmail,
        subject: 'Recuperación de Contraseña',
        text: `Tu código de recuperación es: ${recoveryCode}. Este código es válido por 15 minutos.`
    };

    await transporter.sendMail(mailOptions);
};

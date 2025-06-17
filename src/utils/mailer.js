const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendRecoveryEmail = async (toEmail, recoveryCode) => {
  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL,
    subject: 'Recuperación de Contraseña - DailyDo',
    text: `Tu código de recuperación es: ${recoveryCode}. Este código expira en 15 minutos.`,
    html: `<strong>Tu código de recuperación es:</strong> <code>${recoveryCode}</code><br/>Este código expira en 15 minutos.`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new Error("No se pudo enviar el correo");
  }
};

module.exports = { sendRecoveryEmail };

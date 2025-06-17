
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');



//process.env.FROM_EMAIL

const sendRecoveryEmail = async (toEmail, recoveryCode) => {
  const msg = {
    to: toEmail,
    from: 'dailydoaplication@gmail.com', // Debe estar verificado en SendGrid
    subject: 'Recuperación de Contraseña - DailyDo',
    text: `Tu código de recuperación es: ${recoveryCode}  Este código expira en 15 minutos.`,
    html: `<strong>Tu código de recuperación es:</strong> <code>${recoveryCode}</code><br/>Este código expira en 15 minutos.`,
  };

  try {
    await sgMail.send(msg);
    console.log("Correo de recuperación enviado correctamente");
  } catch (error) {
    console.error("Error al enviar correo:", error.response?.body || error);
    throw new Error("No se pudo enviar el correo");
  }
};

module.exports = { sendRecoveryEmail };
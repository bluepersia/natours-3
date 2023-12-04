const nodemailer = require ('nodemailer');

module.exports = async function (to, subject, message)
{
    const transport = nodemailer.createTransport ({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const options = {
        from: 'Natours <natours.io>',
        to,
        subject,
        message
    }

    await transport.sendMail (options);
}
const nodemailer = require('nodemailer');

const mailSandler = async (email: string, subject: string, text: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: text
    });
  } catch (error: any) {
    console.log(error.response);
  }
}

module.exports = mailSandler;
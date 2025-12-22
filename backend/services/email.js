// import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const EMAIL_FROM = process.env.EMAIL_FROM;
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const service = {
  send: async function (to, subject, text) {
    await transporter.sendMail({
      from: EMAIL_FROM, // sender address
      to, // list of recipients
      subject, // subject line
      text, // plain text body
    });

  },
};

export default service;
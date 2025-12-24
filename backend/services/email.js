import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

console.log("DEBUG SMTP_USER:", process.env.SMTP_USER); 
console.log("DEBUG SMTP_PASS Length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : "Undefined");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const service = {
  send: async function (to, subject, text) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM, 
        to, 
        subject, 
        text, 
      });
      console.log(`Email sent to ${to} via Brevo`);
    } catch (error) {
      console.error("Brevo Error:", error);
      throw new Error("Failed to send email");
    }
  },
};

export default service;
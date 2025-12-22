// email.js
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

// Cấu hình dùng Port 465 (SSL)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // Đổi từ 587 sang 465
  secure: true,       // Đổi false thành true cho port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Thêm logger để xem chi tiết lỗi trên Render logs nếu vẫn fail
  logger: true,
  debug: true,
});

const service = {
  send: async function (to, subject, text) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM, // Dùng biến môi trường
        to,
        subject,
        text,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error("Email send error:", error);
      // Quan trọng: Không throw lỗi để tránh crash server nếu mail lỗi
    }
  },
};

export default service;
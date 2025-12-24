import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https'; // 1. Import thêm thư viện https có sẵn của Node

dotenv.config();

// 2. Tạo Agent để ép buộc dùng IPv4
const httpsAgent = new https.Agent({
  family: 4, // Quan trọng: Force IPv4
  rejectUnauthorized: false, // Bỏ qua lỗi SSL (nếu có) để giảm thiểu rủi ro handshake
});

const service = {
  send: async function (to, subject, text) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_FROM;

    let senderObj = { email: senderEmail };
    if (senderEmail && senderEmail.includes('<')) {
      const match = senderEmail.match(/(.*)<(.*)>/);
      if (match) {
        senderObj = { name: match[1].trim(), email: match[2].trim() };
      }
    }

    const data = {
      sender: senderObj,
      to: [{ email: to }],
      subject: subject,
      textContent: text, 
      htmlContent: `<p>${text}</p>`, 
    };

    console.log(`[Email Service] Attempting to send to ${to}...`);

    try {
      await axios.post('https://api.brevo.com/v3/smtp/email', data, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        httpsAgent: httpsAgent, // 3. Áp dụng Agent vào request axios
        timeout: 15000 // Tăng nhẹ timeout lên 15s
      });
      
      console.log(`[API] Email sent successfully to ${to}`);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Brevo API Error:", errorMsg);
      
      // Nếu lỗi là Timeout, ghi chú rõ ràng hơn
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Email timeout (IPv4 forced): Connection to Brevo took too long.`);
      }

      throw new Error(`Failed to send email: ${errorMsg}`);
    }
  },
};

export default service;
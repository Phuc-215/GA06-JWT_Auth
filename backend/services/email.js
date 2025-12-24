import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const service = {
  send: async function (to, subject, text) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_FROM;

    // Brevo API yêu cầu object sender rõ ràng
    let senderObj = { email: senderEmail };
    if (senderEmail.includes('<')) {
      const match = senderEmail.match(/(.*)<(.*)>/);
      if (match) {
        senderObj = { name: match[1].trim(), email: match[2].trim() };
      }
    }

    const data = {
      sender: senderObj,
      to: [{ email: to }],
      subject: subject,
      // Brevo ưu tiên htmlContent, dùng textContent làm nội dung text thuần
      textContent: text, 
      htmlContent: `<p>${text}</p>`, // Bọc thẻ p đơn giản để thành HTML
    };

    try {
      await axios.post('https://api.brevo.com/v3/smtp/email', data, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        timeout: 10000 // Timeout 10s để không treo server
      });
      
      console.log(`[API] Email sent successfully to ${to}`);
      
    } catch (error) {
      // Log lỗi chi tiết từ Brevo trả về
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Brevo API Error:", errorMsg);
      
      // Ném lỗi để Auth Controller bắt được và chặn tạo User
      throw new Error(`Failed to send email: ${errorMsg}`);
    }
  },
};

export default service;
// controllers/auth.js
import userService from '../services/user.js'
import authService from '../services/auth.js'
import emailService from '../services/email.js'

const controller = {
  register: async function (req, res) {
    const { email, password } = req.body;
    
    // 1. Kiểm tra email đã tồn tại chưa
    const found = await userService.findByEmail(email);
    if (found) {
      return res.status(409).json({
        message: 'Email exists',
      });
    }

    const otp = await authService.generateOTP();

    // 2. Thử gửi Email TRƯỚC
    try {
      await emailService.send(email, 'Welcome to Web Application Development Demo', `Your OTP is ${otp}`);
    } catch (error) {
      // Nếu gửi mail lỗi -> Dừng ngay lập tức, không tạo user
      return res.status(500).json({
        message: 'Could not send OTP email. Please check your email address or try again later.',
      });
    }

    // 3. Nếu gửi email thành công -> Mới tạo User
    try {
      const result = await userService.create({
        email,
        encryptedPassword: await authService.hashPassword(password),
        otp,
      });

      // Created
      res.status(201).json({
        id: result.id,
        email: result.email,
      });
    } catch (dbError) {
      // Trường hợp hiếm: Email gửi được nhưng lưu DB lỗi
      // (Thực tế nên có cơ chế rollback hoặc retry, nhưng ở mức cơ bản thì return lỗi là đủ)
      return res.status(500).json({
        message: 'Database error while creating user',
      });
    }
  },

  // ... các hàm login, getCurrentUser giữ nguyên ...
  
  // (Phần Login, getCurrentUser... giữ nguyên như code cũ của bạn)
  login: async function (req, res) {
    const { email, password } = req.body;
    const found = await userService.findByEmail(email);
    if (!found) {
      return res.status(401).json({ message: 'Email/Password invalid' });
    }
    const result = await authService.validatePassword(password, found.encryptedPassword);
    if (!result) {
      return res.status(401).json({ message: 'Email/Password invalid' });
    }
    const token = await authService.generateToken({
      id: found.id,
      email: found.email,
      isAdmin: found.isAdmin,
      isActivte: found.isActivte,
    });
    res.status(200).json({ token });
  },

  getCurrentUser: async function (req, res) {
    const { currentUser } = req;
    res.status(200).json({
      id: currentUser.id,
      email: currentUser.email,
      isAdmin: currentUser.isAdmin,
    });
  },

  activate: async function (req, res) {
    const { email, otp } = req.body;
    const found = await userService.findByEmail(email);
    if (!found || found.isActivte || otp !== found.otp) {
      return res.unauthorized();
    }
    found.otp = null;
    found.isActivte = true;
    await userService.update(found);
    res.ok({});
  }
}

export default controller;
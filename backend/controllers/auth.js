import userService from '../services/user.js'
import authService from '../services/auth.js'
import emailService from '../services/email.js'

const controller = {
  register: async function (req, res) {
    const { email, password } = req.body;
    // Check if email exists
    const found = await userService.findByEmail(email);
    if (found) {
      // Conflict
      return res.status(409).json({
        message: 'Email exists',
      });
    }
    const otp = await authService.generateOTP();
    const result = await userService.create({
      email,
      encryptedPassword: await authService.hashPassword(password),
      otp,
    });
    // Send welcome email
    await emailService.send(email, 'Welcome to Web Application Development Demo', `Your OTP is ${otp}`);

    // Created
    res.status(201).json({
      id: result.id,
      email: result.email,
    });
  },

  login: async function (req, res) {
    const { email, password } = req.body;
    // Check if email exists
    const found = await userService.findByEmail(email);
    if (!found) {
      // Unauthorized
      return res.status(401).json({
        message: 'Email/Password invalid',
      });
    }
    // Check password
    const result = await authService.validatePassword(password, found.encryptedPassword);
    if (!result) {
      // Unauthorized
      return res.status(401).json({
        message: 'Email/Password invalid',
      });
    }
    // JWT token
    const token = await authService.generateToken({
      id: found.id,
      email: found.email,
      isAdmin: found.isAdmin,
      isActivte: found.isActivte,
    });
    res.status(200).json({
      token,
    });
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
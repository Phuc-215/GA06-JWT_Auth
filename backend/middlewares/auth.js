import authService from '../services/auth.js';

export default async function (req, res, next) {
  const authorization = req.header('Authorization');
  // Authorization: Bearer ey...
  const token = authorization?.replace('Bearer ', '');
  if (token) {
    // Validate token
    const result = await authService.validateToken(token);
    if (!result) {
      // Unauthorized
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
    req.currentUser = result;
  }
  next();
}
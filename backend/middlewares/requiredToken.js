export default function requiredToken(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  next();
}
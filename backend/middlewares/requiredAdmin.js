export default function requiredAdmin(req, res, next) {
  if (!req.currentUser || !req.currentUser.isAdmin) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  next();
}
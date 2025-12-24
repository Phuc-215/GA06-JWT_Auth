export default function requiredActive(req, res, next) {
  if (!req.currentUser || !req.currentUser.isActivte) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  next();
}
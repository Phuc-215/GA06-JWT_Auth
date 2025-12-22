export default function requiredActive(req, res, next) {
  console.log(req.currentUser);
  if (!req.currentUser || !req.currentUser.isActivte) {
    console.log("Inactive");
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  next();
}
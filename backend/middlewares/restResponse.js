export default function restResponse(req, res, next) {
  res.unauthorized = () => {
    res.status(401).json({
      message: 'Unathorized',
    });
  };

  res.notFound = () => {
    res.status(404).json({
      message: 'Not found',
    });
  };

  res.created = () => {
    res.status(201).json({
      message: 'Created',
    });
  };

  res.ok = (data) => {
    res.status(200).json(data);
  }

  next();
}
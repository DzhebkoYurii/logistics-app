module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  
  res.status(status).json({
    timestamp: new Date().toISOString(),
    status: status,
    message: err.message || 'Internal Server Error',
    path: req.originalUrl 
  });
};
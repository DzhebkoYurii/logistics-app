const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      timestamp: new Date().toISOString(),
      status: 400,
      message: 'Validation failed',
      path: req.originalUrl,
      details: errors.array() 
    });
  }
  next();
};
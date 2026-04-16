const service = require('../services/statusService');
const { validationResult } = require('express-validator');

module.exports = {
  getAll: (req, res) => {
    res.json(service.getAll());
  },

  getByShipmentId: (req, res, next) => {
    try {
      res.json(service.getByShipmentId(req.params.shipmentId));
    } catch (e) { next(e); }
  },

  getLatestForShipment: (req, res, next) => {
    try {
      res.json(service.getLatestForShipment(req.params.shipmentId));
    } catch (e) { next(e); }
  },

  create: (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      res.status(201).json(service.create(req.body));
    } catch (e) { next(e); }
  }
};
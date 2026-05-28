const service = require('../services/statusService');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      res.json(await service.getAll());
    } catch (e) { next(e); }
  },

  getByShipmentId: async (req, res, next) => {
    try {
      res.json(await service.getByShipmentId(req.params.shipmentId));
    } catch (e) { next(e); }
  },

  getLatestForShipment: async (req, res, next) => {
    try {
      res.json(await service.getLatestForShipment(req.params.shipmentId));
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      res.status(201).json(await service.create(req.body));
    } catch (e) { next(e); }
  }
};
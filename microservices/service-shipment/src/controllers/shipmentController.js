const service = require('../services/shipmentService');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      res.json(await service.getAll());
    } catch (e) { next(e); }
  },

  getById: async (req, res, next) => {
    try {
      res.json(await service.getById(req.params.id));
    } catch (e) { next(e); }
  },

  trackByNumber: async (req, res, next) => {
    try {
      res.json(await service.trackByNumber(req.params.trackingNumber));
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      res.status(201).json(await service.create(req.body));
    } catch (e) { next(e); }
  },

  update: async (req, res, next) => {
    try {
      res.json(await service.update(req.params.id, req.body));
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  },

  transferShipment: async (req, res, next) => {
    try {
      const { shipmentId, fromWarehouseId, toWarehouseId } = req.body;
      res.json(await service.transferShipment(shipmentId, fromWarehouseId, toWarehouseId));
    } catch (e) { next(e); }
  }
};
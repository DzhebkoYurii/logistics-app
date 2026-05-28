const service = require('../services/warehouseService');

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

  transferCapacity: async (req, res, next) => {
    try {
      const { fromWarehouseId, toWarehouseId } = req.body;
      res.json(await service.transferCapacity(fromWarehouseId, toWarehouseId));
    } catch (e) { next(e); }
  }

};
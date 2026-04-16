const service = require('../services/clientService');
const { validationResult } = require('express-validator');

module.exports = {
  getAll: (req, res) => {
    res.json(service.getAll());
  },

  getById: (req, res, next) => {
    try {
      res.json(service.getById(req.params.id));
    } catch (e) { next(e); }
  },

  create: (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      res.status(201).json(service.create(req.body));
    } catch (e) { next(e); }
  },

  update: (req, res, next) => {
    try {
      res.json(service.update(req.params.id, req.body));
    } catch (e) { next(e); }
  },

  remove: (req, res, next) => {
    try {
      service.remove(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  }
};
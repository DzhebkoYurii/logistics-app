const service = require('../services/warehouseService');
const redisClient = require('../config/redis');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      console.time('fetch-warehouses'); 

      // Перевіряємо кеш
      const cachedData = await redisClient.get('warehouses_list');
      if (cachedData) {
        console.timeEnd('fetch-warehouses');
        return res.json(JSON.parse(cachedData)); 
      }

      // Якщо кешу немає, дістаємо з бази
      const warehouses = await service.getAll();
      
      // Зберігаємо в кеш на 1 годину (3600 секунд)
      await redisClient.setEx('warehouses_list', 3600, JSON.stringify(warehouses));

      console.timeEnd('fetch-warehouses');
      res.json(warehouses);
    } catch (e) { next(e); }
  },

  getById: async (req, res, next) => {
    try {
      res.json(await service.getById(req.params.id));
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      const warehouse = await service.create(req.body);
      await redisClient.del('warehouses_list'); // очищаємо кеш
      res.status(201).json(warehouse);
    } catch (e) { next(e); }
  },

  update: async (req, res, next) => {
    try {
      const updatedWarehouse = await service.update(req.params.id, req.body);
      await redisClient.del('warehouses_list'); // очищаємо кеш
      res.json(updatedWarehouse);
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      await redisClient.del('warehouses_list'); // очищаємо кеш
      res.status(204).send();
    } catch (e) { next(e); }
  },

  transferCapacity: async (req, res, next) => {
    try {
      const { fromWarehouseId, toWarehouseId } = req.body;
      const result = await service.transferCapacity(fromWarehouseId, toWarehouseId);
      await redisClient.del('warehouses_list'); // очищаємо кеш
      res.json(result);
    } catch (e) { next(e); }
  }

};
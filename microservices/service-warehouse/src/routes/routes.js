const router = require('express').Router();
const warehouseCtrl = require('../controllers/warehouseController'); 
const validate = require('../middleware/validate');

router.get('/warehouses',      warehouseCtrl.getAll);
router.get('/warehouses/:id',  warehouseCtrl.getById);
router.post('/warehouses',     warehouseCtrl.create);
router.put('/warehouses/:id',  warehouseCtrl.update);
router.delete('/warehouses/:id', warehouseCtrl.remove);
router.post('/warehouses/transfer-capacity', warehouseCtrl.transferCapacity);

module.exports = router;
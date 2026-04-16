const router = require('express').Router();
const { body } = require('express-validator');

const clientCtrl    = require('../controllers/clientController');
const shipmentCtrl  = require('../controllers/shipmentController');
const warehouseCtrl = require('../controllers/warehouseController');
const routeCtrl     = require('../controllers/routeController');
const transportCtrl = require('../controllers/transportController');
const statusCtrl    = require('../controllers/statusController');

// --- Clients ---
const clientRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
];
router.get('/clients',         clientCtrl.getAll);
router.get('/clients/:id',     clientCtrl.getById);
router.post('/clients',        clientRules, clientCtrl.create);
router.put('/clients/:id',     clientCtrl.update);
router.delete('/clients/:id',  clientCtrl.remove);

// --- Shipments ---
router.get('/shipments',                 shipmentCtrl.getAll);
router.get('/shipments/track/:trackingNumber', shipmentCtrl.trackByNumber); 
router.get('/shipments/:id',             shipmentCtrl.getById);
router.post('/shipments', [
  body('weight').isFloat({ min: 0.1 }).withMessage('Weight must be positive'),
  body('clientId').isInt().withMessage('clientId must be integer'),
], shipmentCtrl.create);
router.put('/shipments/:id',    shipmentCtrl.update);
router.delete('/shipments/:id', shipmentCtrl.remove);

// --- Warehouses ---
router.get('/warehouses',      warehouseCtrl.getAll);
router.get('/warehouses/:id',  warehouseCtrl.getById);
router.post('/warehouses/transfer', warehouseCtrl.transferShipment); 
router.post('/warehouses',     warehouseCtrl.create);
router.put('/warehouses/:id',  warehouseCtrl.update);
router.delete('/warehouses/:id', warehouseCtrl.remove);

// --- Routes ---
router.get('/routes',          routeCtrl.getAll);
router.get('/routes/optimize', routeCtrl.optimize); 
router.get('/routes/:id',      routeCtrl.getById);
router.post('/routes',         routeCtrl.create);
router.put('/routes/:id',      routeCtrl.update);
router.delete('/routes/:id',   routeCtrl.remove); 

// --- Transports ---
router.get('/transports',           transportCtrl.getAll);
router.get('/transports/available', transportCtrl.getAvailable); 
router.get('/transports/:id',       transportCtrl.getById);
router.post('/transports',          transportCtrl.create);
router.put('/transports/:id',       transportCtrl.update);
router.delete('/transports/:id',    transportCtrl.remove); 

// --- Statuses ---
router.get('/statuses',                         statusCtrl.getAll);
router.post('/statuses',                        statusCtrl.create);
router.get('/statuses/shipment/:shipmentId',    statusCtrl.getByShipmentId); 
router.get('/statuses/shipment/:shipmentId/latest', statusCtrl.getLatestForShipment); 

module.exports = router;
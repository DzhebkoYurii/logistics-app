const router = require('express').Router();
const { body } = require('express-validator');

const validate = require('../middleware/validate');

const clientCtrl    = require('../controllers/clientController');
const shipmentCtrl  = require('../controllers/shipmentController');
const statusCtrl    = require('../controllers/statusController');

// --- Clients ---
const clientRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
];
router.get('/clients',         clientCtrl.getAll);
router.get('/clients/:id',     clientCtrl.getById);
router.post('/clients',        clientRules, validate, clientCtrl.create);
router.put('/clients/:id',     clientCtrl.update);
router.delete('/clients/:id',  clientCtrl.remove);

// --- Shipments ---
router.get('/shipments',                 shipmentCtrl.getAll);
router.get('/shipments/track/:trackingNumber', shipmentCtrl.trackByNumber); 
router.get('/shipments/:id',             shipmentCtrl.getById);
router.post('/shipments', [
  body('weight').isFloat({ min: 0.1 }).withMessage('Weight must be positive'),
  body('clientId').isInt().withMessage('clientId must be integer'),
], validate, shipmentCtrl.create);
router.put('/shipments/:id',    shipmentCtrl.update);
router.delete('/shipments/:id', shipmentCtrl.remove);

// --- Statuses ---
router.get('/statuses',                         statusCtrl.getAll);
router.post('/statuses',                        statusCtrl.create);
router.get('/statuses/shipment/:shipmentId',    statusCtrl.getByShipmentId); 
router.get('/statuses/shipment/:shipmentId/latest', statusCtrl.getLatestForShipment); 

module.exports = router;
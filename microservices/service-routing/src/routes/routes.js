const router = require('express').Router();
const validate = require('../middleware/validate'); 

const routeCtrl     = require('../controllers/routeController');
const transportCtrl = require('../controllers/transportController');

// --- Transports ---
router.get('/transports',           transportCtrl.getAll);
router.get('/transports/available', transportCtrl.getAvailable); 
router.get('/transports/:id',       transportCtrl.getById);
router.post('/transports',          transportCtrl.create);
router.put('/transports/:id',       transportCtrl.update);
router.delete('/transports/:id',    transportCtrl.remove); 

// --- Routes ---
router.get('/routes',          routeCtrl.getAll);
router.post('/routes/optimize', routeCtrl.optimize);
router.get('/routes/:id',      routeCtrl.getById);
router.post('/routes',         routeCtrl.create);
router.put('/routes/:id',      routeCtrl.update);
router.delete('/routes/:id',   routeCtrl.remove); 

module.exports = router;
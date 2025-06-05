const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware'); // do obsługi JWT/autoryzacji

// Wszystkie endpointy wymagają autoryzacji
router.get('/taken-slots', patientController.getTakenSlots);

router.use(authMiddleware);

router.get('/appointments', patientController.getAppointments);
router.delete('/appointments/:id', patientController.cancelAppointment);
router.get('/profile', patientController.getProfile);



module.exports = router;

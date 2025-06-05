const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware'); // do obsługi JWT/autoryzacji
const doctorController = require('../controllers/doctorController');

// Wszystkie endpointy wymagają autoryzacji
router.use(authMiddleware);
router.get('/taken-slots', patientController.getTakenSlots);
router.get('/appointments', patientController.getAppointments);
router.delete('/appointments/:id', patientController.cancelAppointment);

router.get('/doctor', doctorController.getProfile);
//router.get('/doctorGetAppointments', doctorController.getAppointments);
// doctor.routes.js
router.get('/doctorGetAppointments', doctorController.getDoctorAppointments);



module.exports = router;

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

//router.post('/appointments', appointmentController.createAppointment);
router.post('/', appointmentController.createAppointment);

module.exports = router;

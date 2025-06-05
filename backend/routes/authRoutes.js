const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const doctorAuthController = require('../controllers/doctorAuthController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/login-doctor', doctorAuthController.loginDoctor);

module.exports = router;

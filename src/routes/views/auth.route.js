const express = require('express');
const authController = require('../../controllers/views/auth.controller');

const router = express.Router();

router.get('/login', authController.login);
router.get('/register', authController.register);

module.exports = router;

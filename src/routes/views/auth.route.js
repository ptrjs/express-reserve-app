const express = require('express');
const authController = require('../../controllers/views/auth.controller');
const sessionHandler = require('../../middlewares/session');

const router = express.Router();

router.get('/login', sessionHandler.whenLogout, authController.loginPage);
router.post('/login', sessionHandler.whenLogout, authController.loginForm);

router.get('/register', sessionHandler.whenLogout, authController.registerPage);
router.post('/register', sessionHandler.whenLogout, authController.registerForm);

router.get('/forgot-password', sessionHandler.whenLogout, authController.forgotPasswordPage);
router.post('/forgot-password', sessionHandler.whenLogout, authController.forgotPasswordForm);

router.get('/reset-password', sessionHandler.whenLogout, authController.resetPasswordPage);
router.post('/reset-password', sessionHandler.whenLogout, authController.resetPasswordForm);

router.post('/logout', authController.logoutForm);

module.exports = router;

const express = require('express');
const homeController = require('../../controllers/views/home.controller');
const sessionHandler = require('../../middlewares/session');

const router = express.Router();

router.get('/', sessionHandler.whenLogin, homeController.homePage);

module.exports = router;

const express = require('express');
const sessionHandler = require('../../middlewares/session');
const userController = require('../../controllers/views/user.controller');

const route = express.Router();

route.get('/', sessionHandler.whenLogin(), userController.mainPage);
route.post('/create', sessionHandler.whenLogin(), userController.createForm);
route.post('/update/:userId', sessionHandler.whenLogin(), userController.createForm);
route.post('/delete/:userId', sessionHandler.whenLogin(), userController.deleteForm);

module.exports = route;

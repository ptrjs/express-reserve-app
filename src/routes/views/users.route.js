const express = require('express');
const sessionHandler = require('../../middlewares/session');
const userController = require('../../controllers/views/user.controller');

const route = express.Router();

route.get('/', sessionHandler.whenLogin(true), userController.mainPage);
route.post('/create', sessionHandler.whenLogin(true), userController.createForm);
route.post('/update/:userId', sessionHandler.whenLogin(true), userController.updateForm);
route.post('/delete/:userId', sessionHandler.whenLogin(true), userController.deleteForm);

module.exports = route;

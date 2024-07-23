const express = require('express');
const sessionHandler = require('../../middlewares/session');
const eventController = require('../../controllers/views/event.controller');

const route = express.Router();

route.get('/', sessionHandler.whenLogin(true), eventController.eventPage);
route.get('/create', sessionHandler.whenLogin(true), eventController.eventPageCreate);
route.post('/create', sessionHandler.whenLogin(true), eventController.eventPageCreateForm);
route.get('/update', sessionHandler.whenLogin(true), eventController.eventPageUpdate);
route.post('/update', sessionHandler.whenLogin(true), eventController.eventPageUpdateForm);
route.post('/delete', sessionHandler.whenLogin(true), eventController.eventDeleteForm);

module.exports = route;

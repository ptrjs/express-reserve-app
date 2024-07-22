const express = require('express');
const sessionHandler = require('../../middlewares/session');
const eventController = require('../../controllers/views/event.controller');

const route = express.Router();

route.get('/', sessionHandler.whenLogin, eventController.eventPage);
route.get('/create', sessionHandler.whenLogin, eventController.eventPageCreate);
route.post('/create', sessionHandler.whenLogin, eventController.eventPageCreateForm);
route.get('/update', sessionHandler.whenLogin, eventController.eventPageUpdate);
route.post('/update', sessionHandler.whenLogin, eventController.eventPageUpdateForm);
route.post('/delete', sessionHandler.whenLogin, eventController.eventDeleteForm);

module.exports = route;

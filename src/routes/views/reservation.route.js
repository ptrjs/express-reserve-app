const express = require('express');
const sessionHandler = require('../../middlewares/session');
const reservationController = require('../../controllers/views/event.controller');

const route = express.Router();

route.get('/', sessionHandler.whenLogin, reservationController.eventPage);
route.get('/create', sessionHandler.whenLogin, reservationController.eventPageCreate);
route.post('/create', sessionHandler.whenLogin, reservationController.eventPageCreateForm);
route.get('/update', sessionHandler.whenLogin, reservationController.eventPageUpdate);
route.post('/update', sessionHandler.whenLogin, reservationController.eventPageUpdateForm);
route.post('/delete', sessionHandler.whenLogin, reservationController.eventDeleteForm);

module.exports = route;

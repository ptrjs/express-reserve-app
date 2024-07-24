const express = require('express');
const sessionHandler = require('../../middlewares/session');
const reservationController = require('../../controllers/views/reservation.controller');

const route = express.Router();

route.get('/:eventId', sessionHandler.whenLogin(), reservationController.reservationPageCreate);
route.post('/:eventId', sessionHandler.whenLogin(), reservationController.reservationPageCreateForm);
route.post('/delete/:reservationId', sessionHandler.whenLogin(), reservationController.reservationDeleteForm);

module.exports = route;

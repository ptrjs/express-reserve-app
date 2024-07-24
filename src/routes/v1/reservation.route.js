const express = require('express');
const { auth } = require('../../middlewares/auth');

const validate = require('../../middlewares/validate');
const reservationValidation = require('../../validations/reservation.validation');
const reservationController = require('../../controllers/api/reservation.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reservationValidation.createReservation), reservationController.createReservation)
  .get(auth(), reservationController.getReservations);

router
  .route('/delete-many')
  .delete(
    auth(),
    validate(reservationValidation.deleteManyReservations),
    reservationController.deleteManyReservations
  );

router
  .route('/reserve-many')
  .post(
    auth(),
    validate(reservationValidation.createManyReservations),
    reservationController.createManyReservations
  );

router
  .route('/:reservationId')
  .get(auth(), validate(reservationValidation.getReservation), reservationController.getReservation)
  .patch(auth(), validate(reservationValidation.updateReservation), reservationController.updateReservation)
  .delete(auth(), validate(reservationValidation.deleteReservation), reservationController.deleteReservation);

module.exports = router;

const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { reservationService } = require('../../services');

const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Reservation Success',
    data: reservation,
  });
});

const getReservations = catchAsync(async (req, res) => {
  const { skip, take } = req.query;
  const result = await reservationService.getAllReservation(skip, take);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Reservations Success',
    data: result,
  });
});

const getReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.reservationId);
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Reservation Success',
    data: reservation,
  });
});

const updateReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.updateReservationById(req.params.reservationId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Reservation Success',
    data: reservation,
  });
});

const deleteReservation = catchAsync(async (req, res) => {
  await reservationService.deleteReservationById(req.params.reservationId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Reservation Success',
    data: null,
  });
});

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
};

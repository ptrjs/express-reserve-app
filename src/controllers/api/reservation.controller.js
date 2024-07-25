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
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const totalReservations = await reservationService.getReservationCount();
  const result = await reservationService.getAllReservation(parseInt(page), parseInt(limit));

  const totalPages = Math.ceil(totalReservations / parseInt(limit));

  res.status(httpStatus.OK).send({
    results: result,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: totalPages,
    totalResults: totalReservations,
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

const deleteManyReservations = catchAsync(async (req, res) => {
  const { ids } = req.body;
  await reservationService.deleteManyReservations(ids);

  res.status(httpStatus.NO_CONTENT).send();
});

const createManyReservations = catchAsync(async (req, res) => {
  const { eventIds } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(eventIds) || eventIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event IDs must be a non-empty array');
  }


  const reservations = await reservationService.createManyReservations(userId, eventIds);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Reservations created successfully',
    data: reservations,
  });
});


module.exports = {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
  deleteManyReservations,
  createManyReservations
};

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
  const { skip = 0, take = 10 } = req.query;
  const totalReservations = await reservationService.getReservationCount();
  const result = await reservationService.getAllReservation(parseInt(skip), parseInt(take));

  const page = Math.floor(parseInt(skip) / parseInt(take)) + 1;
  const totalPages = Math.ceil(totalReservations / parseInt(take));

  res.status(httpStatus.OK).send({
    results: result,
    page: page,
    limit: parseInt(take),
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


module.exports = {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
  deleteManyReservations
};

const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { eventService } = require('../../services');

const createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Event Success',
    data: event,
  });
});
const getEvents = catchAsync(async (req, res) => {
  const { skip = 0, take = 10 } = req.query;
  const totalEvents = await eventService.getEventCount();
  const result = await eventService.getAllEvent(parseInt(skip), parseInt(take));

  const page = Math.floor(parseInt(skip) / parseInt(take)) + 1;
  const totalPages = Math.ceil(totalEvents / parseInt(take));

  res.status(httpStatus.OK).send({
    results: result,
    page: page,
    limit: parseInt(take),
    totalPages: totalPages,
    totalResults: totalEvents,
  });
});


const getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Event Success',
    data: event,
  });
});

const updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.updateEventById(req.params.eventId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Event Success',
    data: event,
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventService.deleteEventById(req.params.eventId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Event Success',
    data: null,
  });
});

const deleteManyEvents = catchAsync(async (req, res) => {
  const { ids } = req.body;
  await eventService.deleteManyEvents(ids);

  res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  deleteManyEvents
};

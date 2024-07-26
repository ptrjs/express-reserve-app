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
  const { page = 1, limit = 10 } = req.query;
  const totalEvents = await eventService.getEventCount();
  const result = await eventService.getAllEvent(parseInt(page), parseInt(limit));

  const totalPages = Math.ceil(totalEvents / parseInt(limit));

  res.status(httpStatus.OK).send({
    results: result,
    page: parseInt(page),
    limit: parseInt(limit),
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

const getUserEvents = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  const { events, totalUserEvents } = await eventService.getEventsByUserId(userId, parseInt(page), parseInt(limit));

  const totalPages = Math.ceil(totalUserEvents / limit);
  const currentPage = parseInt(page);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User Events Success',
    results: events,
    page: currentPage,
    limit: parseInt(limit),
    totalPages: totalPages,
    totalResults: totalUserEvents,
  });
});



module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  deleteManyEvents,
  getUserEvents
};

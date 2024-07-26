const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Create an event
 * @param {Object} eventBody
 * @returns {Promise<Event>}
 */
const createEvent = async (eventBody) => {
  return prisma.event.create({
    data: eventBody,
  });
};

/**
 * Query for events
 * @returns {Promise<QueryResult>}
 */
const queryEvents = async (filter, options) => {
  const events = await prisma.event.findMany();
  return events;
};

/**
 * Get event by id
 * @param {ObjectId} id
 * @returns {Promise<Event>}
 */
const getEventById = async (id) => {
  return prisma.event.findFirst({
    where: {
      id,
    },
    include: {
      reservations: {
        include: {
          User: true,
        },
      },
    },
  });
};


/**
 * Update event by id
 * @param {ObjectId} eventId
 * @param {Object} updateBody
 * @returns {Promise<Event>}
 */
const updateEventById = async (eventId, updateBody) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  const updateEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: updateBody,
  });

  return updateEvent;
};

/**
 * Delete event by id
 * @param {ObjectId} eventId
 * @returns {Promise<Event>}
 */
const deleteEventById = async (eventId) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  const deleteEvents = await prisma.event.deleteMany({
    where: {
      id: eventId,
    },
  });

  return deleteEvents;
};

const getAllEvent = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const events = await prisma.event.findMany({
    skip: parseInt(skip),
    take: parseInt(limit),
    include: {
      reservations: {
        include: {
          User: true,
        },
      },
    },
  });
  return events;
};

const getEventCount = async () => {
  const count = await prisma.event.count();
  return count;
};

const deleteManyEvents = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'IDs must be a non-empty array');
  }

  const deleteResult = await prisma.event.deleteMany({
      where: {
        id: { in: ids },
      },
  });

  return deleteResult;
};


/**
 * Get events by user id
 * @param {ObjectId} userId
 * @param {number} skip
 * @param {number} take
 * @returns {Promise<Array<Event>>}
 */
const getEventsByUserId = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const userEvents = await prisma.reservation.findMany({
    where: { userId },
    include: {
      Event: true,
    },
    skip: parseInt(skip),
    take: parseInt(limit),
  });

  const totalUserEvents = await prisma.reservation.count({
    where: { userId },
  });

    const events = userEvents.map(reservation => ({
      ...reservation.Event,
      reservationId: reservation.id
    })
  );

  return {
    events,
    totalUserEvents,
  };
};


module.exports = {
  createEvent,
  queryEvents,
  getEventById,
  getEventCount,
  getAllEvent,
  updateEventById,
  deleteEventById,
  deleteManyEvents,
  getEventsByUserId
};

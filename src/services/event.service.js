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
        }
      }
    }
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

const getAllEvent = async (skip = 0, take = 10) => {
  const events = await prisma.event.findMany({
    skip: parseInt(skip),
    take: parseInt(take),
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

module.exports = {
  createEvent,
  queryEvents,
  getEventById,
  getEventCount,
  getAllEvent,
  updateEventById,
  deleteEventById,
};

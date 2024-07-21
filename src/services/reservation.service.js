const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

/**
 * Create an reservation
 * @param {Object} reservationBody
 * @returns {Promise<Reservation>}
 */
const createReservation = async (reservationBody) => {
  const { eventId, userId } = reservationBody;


  return prisma.$transaction(async (prisma) => {

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }


    if (event.quantity <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No slots available');
    }


    const reservation = await prisma.reservation.create({
      data: {
        userId,
        eventId,
      },
    });


    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { quantity: { decrement: 1 } },
    });

    return reservation;
  });
};



/**
 * Query for reservations
 * @returns {Promise<QueryResult>}
 */
const queryReservations = async (filter, options) => {
  const reservations = await prisma.reservation.findMany();
  return reservations;
};

/**
 * Get reservation by id
 * @param {ObjectId} id
 * @returns {Promise<Reservation>}
 */
const getReservationById = async (id) => {
  return prisma.reservation.findFirst({
    where: {
      id,
    },
  });
};

/**
 * Update reservation by id
 * @param {ObjectId} reservationId
 * @param {Object} updateBody
 * @returns {Promise<Reservation>}
 */
const updateReservationById = async (reservationId, updateBody) => {

  return prisma.$transaction(async (prisma) => {

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
    }


    const event = await prisma.event.findUnique({
      where: { id: reservation.eventId },
    });

    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }


    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: updateBody,
    });


    if (updateBody.eventId && updateBody.eventId !== reservation.eventId) {

      await prisma.event.update({
        where: { id: reservation.eventId },
        data: { quantity: { increment: 1 } },
      });


      await prisma.event.update({
        where: { id: updateBody.eventId },
        data: { quantity: { decrement: 1 } },
      });
    }

    return updatedReservation;
  });
};


/**
 * Delete reservation by id
 * @param {ObjectId} reservationId
 * @returns {Promise<Reservation>}
 */
const deleteReservationById = async (reservationId) => {
  const reservation = await getReservationById(reservationId);
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }


  return prisma.$transaction(async (prisma) => {

    await prisma.reservation.delete({
      where: {
        id: reservationId,
      },
    });


    const updatedEvent = await prisma.event.update({
      where: { id: reservation.eventId },
      data: { quantity: { increment: 1 } },
    });

    return updatedEvent;
  });
};

const getAllReservation = async (skip = 0, take = 10) => {
  const reservations = await prisma.reservation.findMany({
    skip: parseInt(skip),
    take: parseInt(take),
  });
  return reservations;
};

const getReservationCount = async () => {
  const count = await prisma.reservation.count();
  return count;
};

module.exports = {
  createReservation,
  queryReservations,
  getReservationById,
  getReservationCount,
  getAllReservation,
  updateReservationById,
  deleteReservationById,
};

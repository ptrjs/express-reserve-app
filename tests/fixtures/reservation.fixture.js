const { v4: uuidv4 } = require('uuid');
const faker = require('faker');
const prisma = require('../../prisma');
const { eventOne } = require('./event.fixture');
const { userOne, userTwo } = require('./user.fixture');

const reservationOne = {
    id: uuidv4(),
    userId:userOne.id,
    eventId:eventOne.id,
};

const reservationTwo = {
  id: uuidv4(),
  userId:userTwo.id,
  eventId:eventOne.id,
};

const insertReservations = async (reservations) => {
    reservations = reservations.map((reservation) => ({ ...reservation}));
    await prisma.reservation.createMany({
      data: reservations,
      skipDuplicates: true,
    });
};

module.exports = {
    reservationOne,
    reservationTwo,
    insertReservations,
};

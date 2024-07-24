const { v4: uuidv4 } = require('uuid');
const faker = require('faker');
const prisma = require('../../prisma');

const eventOne = {
    id: uuidv4(),
    title: faker.commerce.productMaterial(),
    description: faker.commerce.productMaterial(),
    startTime: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-05-01T00:00:00.000Z' }),
    endTime: faker.date.between({ from: '2024-01-10T00:00:00.000Z', to: '2024-05-20T00:00:00.000Z' }),
    quantity: 10
};

const eventTwo = {
    id: uuidv4(),
    title: faker.commerce.productMaterial(),
    description: faker.commerce.productMaterial(),
    startTime: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-05-01T00:00:00.000Z' }),
    endTime: faker.date.between({ from: '2024-01-10T00:00:00.000Z', to: '2024-05-20T00:00:00.000Z' }),
    quantity: 10
};

const insertEvents = async (events) => {
    events = events.map((event) => ({ ...event}));
    await prisma.event.createMany({
      data: events,
      skipDuplicates: true,
    });
};

module.exports = {
    eventOne,
    eventTwo,
    insertEvents,
};

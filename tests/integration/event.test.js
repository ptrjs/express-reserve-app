const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { eventOne, insertEvents } = require('../fixtures/event.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');
const { auth } = require('../../src/middlewares/auth');
const ApiError = require('../../src/utils/ApiError');
const config = require('../../src/config/config');
const { tokenService } = require('../../src/services');
const { tokenTypes } = require('../../src/config/tokens');
const { getAllEvent, getEventById } = require('../../src/services/event.service');
const { v4 } = require('uuid');

describe('Event routes', ()=>{

    describe('GET /v1/event', ()=>{

        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertEvents([eventOne]);
        });

        test('should return 200 and successfully get all events', async ()=>{
            const res = await request(app)
            .get('/v1/event')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);

        });

        test('should return 401 unauthorized if token not set', async () => {
            const res =await request(app)
                .get('/v1/event')
                .expect(httpStatus.UNAUTHORIZED);
        });

    })

    describe('POST /v1/event', ()=>{
        let newEvent;

        beforeEach(async ()=>{
            await insertUsers([userOne]);
            newEvent = {
                title: faker.commerce.productMaterial(),
                description: faker.commerce.productMaterial(),
                startTime: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-05-01T00:00:00.000Z' }),
                endTime: faker.date.between({ from: '2024-01-10T00:00:00.000Z', to: '2024-05-20T00:00:00.000Z' }),
                quantity: 10
            };

        });

        test('should return 201 and successfully create event if request data is ok', async () => {
            const res = await request(app)
                .post('/v1/event')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newEvent)
                .expect(httpStatus.CREATED);


            const eventData = res.body.data;


            expect(eventData).toEqual({
                id: expect.anything(),
                title: newEvent.title,
                description: newEvent.description,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                quantity: newEvent.quantity,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })

            const dbEvent = await prisma.event.findUnique({
                where: {
                  id: eventData.id,
                },
              });

              expect(dbEvent).toBeDefined();

              expect(dbEvent).toMatchObject({
                id: expect.anything(),
                title: newEvent.title,
                description: newEvent.description,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                quantity: newEvent.quantity,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });




        });

        test('should return 400 data is invalid', async () =>{
            const res = await request(app)
            .post('/v1/event')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);

            const errorResponse = res.body;


            expect(errorResponse).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: expect.anything(),
            })

        })

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
                .post('/v1/event')

                .send(newEvent)
                .expect(httpStatus.UNAUTHORIZED);


        });


    })

    describe('PATCH /v1/event/:eventId', ()=>{
        let updatedEvent;

        beforeEach(async () =>{
            await insertUsers([userOne]);
            const insertedEvent = await insertEvents([eventOne]);
            updatedEvent = {
              title: faker.commerce.productMaterial(),
              description: faker.commerce.productMaterial(),
              startTime: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-05-01T00:00:00.000Z' }),
              endTime: faker.date.between({ from: '2024-01-10T00:00:00.000Z', to: '2024-05-20T00:00:00.000Z' }),
              quantity: 10
            }
        })

        test('should return 200 and successfully update event if request data is ok', async ()=>{
            const res = await request(app)
            .patch(`/v1/event/${eventOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(updatedEvent)
            .expect(httpStatus.OK);

            const eventData = res.body.data;

            expect(eventData).toEqual({
              id: eventOne.id,
              title: updatedEvent.title,
              description: updatedEvent.description,
              startTime: updatedEvent.startTime,
              endTime: updatedEvent.endTime,
              quantity: updatedEvent.quantity,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            });

            const dbEvent = await prisma.event.findUnique({
                where: {
                  id: eventData.id,
                },
              });

            expect(dbEvent).toBeDefined();
            expect(dbEvent).toMatchObject({
                id: eventOne.id,
                title: updatedEvent.title,
                description: updatedEvent.description,
                startTime: updatedEvent.startTime,
                endTime: updatedEvent.endTime,
                quantity: updatedEvent.quantity,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });

        })

        test('should return 400 if data is invalid', async () => {
            const res = await request(app)
              .patch(`/v1/event/${eventOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .expect(httpStatus.BAD_REQUEST);

            const errorResponse = res.body;

            expect(errorResponse).toEqual({
              code: httpStatus.BAD_REQUEST,
              message: expect.anything(),
            });
        });

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
              .patch(`/v1/event/${eventOne.id}`)
              .send(updatedEvent)
              .expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 404 if event not found', async () => {

            const res = await request(app)
              .patch(`/v1/event/`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .send(updatedEvent)
              .expect(httpStatus.NOT_FOUND);
          });


    })

    describe('DELETE /v1/event/:eventId', () => {
        beforeEach(async () => {
          await insertUsers([userOne]);
          await insertEvents([eventOne]);
        });

        test('should return 200 and successfully delete event if request is valid', async () => {
          const res = await request(app)
            .delete(`/v1/event/${eventOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);

          const dbEvent = await prisma.event.findUnique({
            where: {
              id: eventOne.id,
            },
          });

          expect(dbEvent).toBeNull();
        });

        test('should return 401 unauthorized if token not set', async () => {
          await request(app)
            .delete(`/v1/event/${eventOne.id}`)
            .expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 404 if event not found', async () => {
          await request(app)
            .delete(`/v1/event/`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });
    });


});

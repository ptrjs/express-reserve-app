const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { eventOne, eventTwo, insertEvents } = require('../fixtures/reservation.fixture');
const { reservationOne, insertReservations } = require('../fixtures/reservation.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');
const { auth } = require('../../src/middlewares/auth');
const ApiError = require('../../src/utils/ApiError');
const config = require('../../src/config/config');
const { tokenService } = require('../../src/services');
const { tokenTypes } = require('../../src/config/tokens');
const { getAllReservation, getReservationById } = require('../../src/services/reservation.service');
const { v4 } = require('uuid');

describe('Reservation routes', ()=>{

    describe('GET /v1/reservation', ()=>{

        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertEvents([eventOne]);
            await insertReservations([reservationOne]);
        });

        test('should return 200 and successfully get all reservations', async ()=>{
            const res = await request(app)
            .get('/v1/reservation')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);

        });

        test('should return 401 unauthorized if token not set', async () => {
            const res =await request(app)
                .get('/v1/reservation')
                .expect(httpStatus.UNAUTHORIZED);
        });

    })

    describe('POST /v1/reservation', ()=>{
        let newReservation;

        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertEvents([eventOne]);
            newReservation = {
                userId: userOne.id,
                eventId: eventOne.id,

            };

        });

        test('should return 201 and successfully create reservation if request data is ok', async () => {
            const res = await request(app)
                .post('/v1/reservation')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newReservation)
                .expect(httpStatus.CREATED);


            const reservationData = res.body.data;


            expect(reservationData).toEqual({
                id: expect.anything(),
                userId: newReservation.userId,
                eventId: newReservation.eventId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })

            const dbReservation = await prisma.reservation.findUnique({
                where: {
                  id: reservationData.id,
                },
              });

              expect(dbReservation).toBeDefined();

              expect(dbReservation).toMatchObject({
                id: expect.anything(),
                userId: newReservation.userId,
                eventId: newReservation.eventId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });




        });

        test('should return 400 data is invalid', async () =>{
            const res = await request(app)
            .post('/v1/reservation')
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
                .post('/v1/reservation')

                .send(newReservation)
                .expect(httpStatus.UNAUTHORIZED);


        });


    })

    describe('PATCH /v1/reservation/:reservationId', ()=>{
        let updatedReservation;

        beforeEach(async () =>{
            await insertUsers([userOne]);
            await insertEvents([eventTwo]);
            const insertedReservation = await insertReservations([reservationOne]);
            updatedReservation = {
              userId: userOne.id,
              eventId: eventTwo.id,
            }
        })

        test('should return 200 and successfully update reservation if request data is ok', async ()=>{
            const res = await request(app)
            .patch(`/v1/reservation/${reservationOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(updatedReservation)
            .expect(httpStatus.OK);

            const reservationData = res.body.data;

            expect(reservationData).toEqual({
              id: reservationOne.id,
              userId: updatedReservation.userId,
              eventId: updatedReservation.eventId,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            });

            const dbReservation = await prisma.reservation.findUnique({
                where: {
                  id: reservationData.id,
                },
              });

            expect(dbReservation).toBeDefined();
            expect(dbReservation).toMatchObject({
                id: reservationOne.id,
                userId: updatedReservation.userId,
                eventId: updatedReservation.eventId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });

        })

        test('should return 400 if data is invalid', async () => {
            const res = await request(app)
              .patch(`/v1/reservation/${reservationOne.id}`)
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
              .patch(`/v1/reservation/${reservationOne.id}`)
              .send(updatedReservation)
              .expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 404 if reservation not found', async () => {

            const res = await request(app)
              .patch(`/v1/reservation/`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .send(updatedReservation)
              .expect(httpStatus.NOT_FOUND);
          });


    })

    describe('DELETE /v1/reservation/:reservationId', () => {
        beforeEach(async () => {
          await insertUsers([userOne]);
          await insertReservations([reservationOne]);
        });

        test('should return 200 and successfully delete reservation if request is valid', async () => {
          const res = await request(app)
            .delete(`/v1/reservation/${reservationOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);

          const dbReservation = await prisma.reservation.findUnique({
            where: {
              id: reservationOne.id,
            },
          });

          expect(dbReservation).toBeNull();
        });

        test('should return 401 unauthorized if token not set', async () => {
          await request(app)
            .delete(`/v1/reservation/${reservationOne.id}`)
            .expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 404 if reservation not found', async () => {
          await request(app)
            .delete(`/v1/reservation/`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });
    });


});

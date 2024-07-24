const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReservation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    eventId: Joi.string().required(),
  }),
};

const getReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

const updateReservation = {
  params: Joi.object().keys({
    reservationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string(),
      eventId: Joi.string(),
    })
    .min(1),
};

const deleteReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

const deleteManyReservations = {
  body: Joi.object().keys({
    ids: Joi.array().items(Joi.string().custom(objectId)),
  }),
};


const createManyReservations = {
  body: Joi.object().keys({
    eventIds: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

module.exports = {
  createReservation,
  getReservation,
  updateReservation,
  deleteReservation,
  deleteManyReservations,
  createManyReservations
};

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEvent = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().optional(), // Menambahkan deskripsi sebagai opsional
    startTime: Joi.date().iso().required(), // Menambahkan startTime sebagai required
    endTime: Joi.date().iso().required(),   // Menambahkan endTime sebagai required
    quantity: Joi.number().integer().min(1).required(), // Menambahkan quantity sebagai required
    createdById: Joi.string().custom(objectId).required() // Menambahkan createdById sebagai required
  }),
};

const getEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

const updateEvent = {
  params: Joi.object().keys({
    eventId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      startTime: Joi.date().iso(),
      endTime: Joi.date().iso(),
      quantity: Joi.number().integer().min(1),
      createdById: Joi.string().custom(objectId)
    })
    .min(1),
};

const deleteEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
};

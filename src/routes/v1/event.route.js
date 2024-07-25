const express = require('express');
const { auth, adminAuth } = require('../../middlewares/auth');

const validate = require('../../middlewares/validate');
const eventValidation = require('../../validations/event.validation');
const eventController = require('../../controllers/api/event.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth(),
    adminAuth(),
    validate(eventValidation.createEvent),
    eventController.createEvent
  )
  .get(auth(), eventController.getEvents);


router
.route('/delete-many')
.delete(
  adminAuth(),
  validate(eventValidation.deleteManyEvents),
  eventController.deleteManyEvents
);

router
  .route('/:eventId')
  .get(auth(), validate(eventValidation.getEvent), eventController.getEvent)
  .patch(
    // auth(),
    adminAuth(),
    validate(eventValidation.updateEvent),
    eventController.updateEvent
  )
  .delete(
    // auth(),
    adminAuth(),
    validate(eventValidation.deleteEvent),
    eventController.deleteEvent
  );

module.exports = router;

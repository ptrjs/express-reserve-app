const express = require('express');
const authRoute = require('./auth.route');
const homeRoute = require('./home.route');
const eventRoute = require('./event.route');
const reservationRoute = require('./reservation.route');

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/home',
    route: homeRoute,
  },
  {
    path: '/event',
    route: eventRoute,
  },
  {
    path: '/reservation',
    route: reservationRoute,
  },
];

const router = express.Router();

routes.forEach((x) => router.use(x.path, x.route));

module.exports = router;

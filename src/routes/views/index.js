const express = require('express');
const authRoute = require('./auth.route');
const homeRoute = require('./home.route');

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/home',
    route: homeRoute,
  },
];

const router = express.Router();

routes.forEach((x) => router.use(x.path, x.route));

module.exports = router;

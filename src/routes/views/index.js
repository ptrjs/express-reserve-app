const express = require('express');
const authRoute = require('./auth.route');

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

const router = express.Router();

routes.forEach((x) => router.use(x.path, x.route));

module.exports = router;

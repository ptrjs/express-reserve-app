const moment = require('moment');
const fetch = require('../../utils/fetch');

const createNavlist = (role) => {
  const navs = [{ name: 'Home', path: '/home' }];
  if (role === 'admin') navs.push({ name: 'Event', path: '/event' }, { name: 'User', path: '/users' });
  return navs;
};

/**
 * @function fetchEvnts
 * @param {import("express").Request} req
 */
const fetchEvents = async (req) => {
  const response = await fetch(`/v1/event?page=${req.query.page || 1}&limit=10`, {
    headers: {
      'Content-Type': 'application-json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
  }).then((x) => x.json());

  return response;
};

const fetchReservations = async (req) => {
  const response = await fetch(`/v1/event/user-events?page=${req.query.page || 1}&limit=10`, {
    headers: {
      'Content-Type': 'application-json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
  }).then((x) => x.json());

  return response;
};

/**
 * @function homePage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const homePage = async (req, res) => {
  let username = 'tanpa nama';
  let role = 'user';
  if (req.session.user) {
    username = req.session.user.name;
    role = req.session.user.role;
  }

  const response = req.query.on === 'reservation' ? await fetchReservations(req) : await fetchEvents(req);
  let events = response.results;

  if (req.query.on !== 'reservation')
    events = events.filter((x) => x.quantity && !x.reservations.find((y) => y.userId === req.session.user.id));

  const format = (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a');

  return res.render('home/index', {
    username,
    navs: createNavlist(role),
    events,
    on: req.query.on,
    user: req.session.user,
    format,
    select: req.query.select,
    page: req.query.page || 1,
    totalPage: response.totalPages || 1,
  });
};

module.exports = {
  homePage,
  createNavlist,
};

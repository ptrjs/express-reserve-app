const moment = require('moment');
const { UNAUTHORIZED } = require('http-status');
const fetch = require('../../utils/fetch');

const createNavlist = (role) => {
  const navs = [{ name: 'Home', path: '/home' }];
  if (role === 'admin') navs.push({ name: 'Event', path: '/event' });
  return navs;
};

/**
 * @function fetchEvnts
 * @param {import("express").Request} req
 */
const fetchEvents = async (req) => {
  const response = await fetch('/v1/event', {
    headers: {
      'Content-Type': 'application-json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
  }).then((x) => x.json());

  if (response.code) return response;

  return response.data;
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

  let events = await fetchEvents(req);

  if (events.code === UNAUTHORIZED) {
    req.session.token = undefined;
    req.session.user = undefined;
    return res.redirect('/');
  }

  if (req.query.on === 'reservation')
    events = events.filter((x) => !!x.reservations.find((y) => y.userId === req.session.user.id));
  else events = events.filter((x) => x.quantity && !x.reservations.find((y) => y.userId === req.session.user.id));

  const format = (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a');

  return res.render('home/index', {
    username,
    navs: createNavlist(role),
    events,
    on: req.query.on,
    user: req.session.user,
    format,
    select: req.query.select,
  });
};

module.exports = {
  homePage,
  createNavlist,
};

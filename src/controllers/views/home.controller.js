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

  const events = await fetchEvents(req).catch(() => []);

  const yourReservations = events.filter((x) => !!x.reservations.find((y) => y.userId === req.session.user.id));
  const available = events.filter((x) => !yourReservations.find((y) => y.id === x.id) && x.quantity);

  return res.render('home/index', { username, navs: createNavlist(role), yourReservations, available });
};

module.exports = {
  homePage,
  createNavlist,
};

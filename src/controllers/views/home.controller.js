const fetch = require('../../utils/fetch');

const createNavlist = (role) => {
  const navs = [{ name: 'home', path: '/home' }];
  if (role === 'admin') navs.push({ name: 'user', path: '/user' }, { name: 'event', path: '/event' });
  return navs.map((x) => `<a href="${x.path}">${x.name}</a>`);
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

  return response.data.map((x) => `<a href="reservation/${x.id}">${x.name}</a>`);
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

  const events = await fetchEvents(req);

  return res.render('home/index', { username, navs: createNavlist(role), events });
};

module.exports = {
  homePage,
  createNavlist,
};

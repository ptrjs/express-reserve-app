const config = require('../config/config');

/**
 * @function fetch
 * @param {string} path
 * @param {RequestInit} init
 */
module.exports = async function (path, init) {
  return fetch(config.server.url + path, init);
};

/**
 * @function fetchEvents
 * @param {import("express").Request} req
 */
module.exports.fetchMyEvents = async (req) => {
  const response = await module
    .exports('/v1/event', {
      headers: {
        'Content-Type': 'application-json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
    })
    .then((x) => x.json());

  return response.results.filter((x) => x.createdById === req.session.user.id);
};

/**
 * @function fetchUsers
 * @param {import("express").Request} req
 */
module.exports.fetchUsers = async (req, page = 1) => {
  const response = await module
    .exports(`/v1/users?page=${page}&limit=10`, {
      headers: {
        'Content-Type': 'application-json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
    })
    .then((x) => x.json());

  return response;
};

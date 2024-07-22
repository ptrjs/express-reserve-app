const config = require('../config/config');

/**
 * @function fetch
 * @param {string} path
 * @param {RequestInit} init
 */
module.exports = async function (path, init) {
  return fetch(config.server.url + path, init);
};

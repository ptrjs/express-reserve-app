const { createNavlist } = require('./home.controller');

/**
 * @function eventPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPage = (req, res) => {
  return res.render('event/index', { navs: createNavlist(req.session.user.role) });
};

/**
 * @function eventPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageCreate = (req, res) => {
  return res.render('event/create');
};

/**
 * @function eventPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageCreateForm = (req, res) => {
  // TODO: add controller;
  res.redirect('/event');
};

/**
 * @function eventPageUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageUpdate = (req, res) => {
  // TODO: add controller;
  res.redirect('/event');
};

/**
 * @function eventPageUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageUpdateForm = (req, res) => {
  // TODO: add controller;
  res.redirect('/event/update');
};

/**
 * @function eventDeleteForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventDeleteForm = (req, res) => {
  // TODO: add controller;
  res.redirect('/event');
};

module.exports = {
  eventPage,
  eventPageCreate,
  eventPageCreateForm,
  eventPageUpdate,
  eventPageUpdateForm,
  eventDeleteForm,
};

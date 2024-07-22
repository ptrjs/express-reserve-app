const { createNavlist } = require('./home.controller');

/**
 * @function reservationPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPage = (req, res) => {
  return res.render('reservation/index', { navs: createNavlist(req.session.user.role) });
};

/**
 * @function reservationPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPageCreate = (req, res) => {
  return res.render('reservation/create');
};

/**
 * @function reservationPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPageCreateForm = (req, res) => {
  // TODO: add controller;
  res.redirect('/reservation');
};

/**
 * @function reservationPageUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPageUpdate = (req, res) => {
  // TODO: add controller;
  res.redirect('/reservation/update');
};

/**
 * @function reservationPageUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPageUpdateForm = (req, res) => {
  // TODO: add controller;
  res.redirect('/reservation');
};

/**
 * @function reservationDeleteForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationDeleteForm = (req, res) => {
  // TODO: add controller;
  res.redirect('/reservation');
};

module.exports = {
  reservationPage,
  reservationPageCreate,
  reservationPageCreateForm,
  reservationPageUpdate,
  reservationPageUpdateForm,
  reservationDeleteForm,
};

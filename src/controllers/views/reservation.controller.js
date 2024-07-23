const moment = require('moment');
const { createNavlist } = require('./home.controller');
const fetch = require('../../utils/fetch');

/**
 * @function reservationPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPage = async (req, res) => {
  // TODO: add controller;
  return res.redirect('/home');
};

/**
 * @function reservationPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPageCreate = async (req, res) => {
  const id = req.params.eventId;
  const response = await fetch(`/v1/event/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
  }).then((x) => x.json());

  if (response.code) res.redirect('/home');
  const { data } = response;
  data.startTime = moment(data.startTime).format('MMMM Do YYYY, h:mm:ss a');
  data.endTime = moment(data.endTime).format('MMMM Do YYYY, h:mm:ss a');
  return res.render('reservation/detail', {
    navs: createNavlist(req.session.user.role),
    data: response.data,
    reservation: data.reservations.find((x) => x.userId === req.session.user.id),
  });
};

/**
 * @function reservationPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const reservationPageCreateForm = async (req, res) => {
  const { eventId } = req.params;
  await fetch(`/v1/reservation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify({
      userId: req.session.user.id,
      eventId,
    }),
  });
  res.redirect('/home');
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
const reservationDeleteForm = async (req, res) => {
  const { reservationId } = req.params;
  await fetch(`/v1/reservation/${reservationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
  });
  res.redirect('/home');
  // TODO: add controller;
};

module.exports = {
  reservationPage,
  reservationPageCreate,
  reservationPageCreateForm,
  reservationPageUpdate,
  reservationPageUpdateForm,
  reservationDeleteForm,
};
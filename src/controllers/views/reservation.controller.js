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
  if (eventId === 'all') {
    const eventIds = Object.values(req.body);
    await fetch(`/v1/reservation/reserve-many`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
      body: JSON.stringify({ eventIds }),
    });
  } else {
    await fetch(`/v1/reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
      body: JSON.stringify({
        userId: req.body.userId || req.session.user.id,
        eventId,
      }),
    });
  }
  return res.redirect(req.query.redirect || '/home');
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
  if (reservationId === 'all') {
    const ids = Object.values(req.body);
    await fetch('/v1/reservation/delete-many', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
      body: JSON.stringify({ ids }),
    });
  } else {
    await fetch(`/v1/reservation/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
    });
  }
  return res.redirect(req.query.redirect || '/home');
};

module.exports = {
  reservationPage,
  reservationPageCreate,
  reservationPageCreateForm,
  reservationPageUpdate,
  reservationPageUpdateForm,
  reservationDeleteForm,
};

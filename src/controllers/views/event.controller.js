const fetch = require('../../utils/fetch');
const { createNavlist } = require('./home.controller');

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

  return response.data
    .filter((x) => x.createdById === req.session.user.id)
    .map(
      (x) =>
        `<a href="event/update?id=${x.id}">${x.title}</a><form action="event/delete?id=${x.id}" method="post"><input type="submit" value="delete"></form>`
    );
};

/**
 * @function eventPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPage = async (req, res) => {
  const events = await fetchEvents(req);
  return res.render('event/index', { navs: createNavlist(req.session.user.role), events });
};

/**
 * @function eventPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageCreate = (req, res) => {
  return res.render('event/create', { message: '' });
};

/**
 * @function eventPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageCreateForm = async (req, res) => {
  req.body.createdById = req.session.user.id;
  const response = await fetch('/v1/event/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

  if (response.code) return res.render('event/create', { message: response.message });
  res.redirect('/event');
};

/**
 * @function eventPageUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageUpdate = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.redirect('/event');
  const response = await fetch(`/v1/event/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
  }).then((x) => x.json());

  response.data.startTime = new Date(response.data.startTime);
  response.data.endTIme = new Date(response.data.endTime);

  return res.render('event/update', { message: '', body: response.data, id });
};

/**
 * @function eventPageUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageUpdateForm = async (req, res) => {
  const { id } = req.query;
  if (!req.body.startTime.length) delete req.body.startTime;
  if (!req.body.endTime.length) delete req.body.endTime;
  if (!id) return res.redirect('/event');
  const response = await fetch(`/v1/event/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

  if (response.code) return res.render('event/create', { message: response.message, body: req.body || {}, id });
  res.redirect('/event/update');
};

/**
 * @function eventDeleteForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventDeleteForm = async (req, res) => {
  const { id } = req.query;
  if (id)
    await fetch(`/v1/event/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
    });
  return res.redirect('/event');
};

module.exports = {
  eventPage,
  eventPageCreate,
  eventPageCreateForm,
  eventPageUpdate,
  eventPageUpdateForm,
  eventDeleteForm,
};

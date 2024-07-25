const moment = require('moment');
const fetch = require('../../utils/fetch');
const { createNavlist } = require('./home.controller');

const renderIndex = async (req, res, action = 'none', message = '', local = {}) => {
  const events = await fetch.fetchMyEvents(req);
  return res.render('event/index', {
    navs: createNavlist(req.session.user.role),
    events,
    select: req.query.select,
    page: Math.min(req.query.page || 1, 1),
    totalPage: 1,
    action,
    message,
    local,
    parseDate: (date) => moment(date).format('YYYY-MM-DDThh:mm'),
  });
};

/**
 * @function eventPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPage = async (req, res) => {
  const mode = req.query.select ? 'select' : '';
  if (Reflect.has(req.query, 'print') && req.query.select) {
    const events = await fetch.fetchMyEvents(req);
    const event = events[req.query.select];
    if (event) return res.render('event/print-reservation', { event });
  }
  return renderIndex(req, res, mode);
};

/**
 * @function eventPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageCreate = async (req, res) => {
  return renderIndex(req, res, 'create');
};

/**
 * @function eventPageCreate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageCreateForm = async (req, res) => {
  req.body.createdById = req.session.user.id;
  req.body.startTime = new Date(req.body.startTime).toISOString();
  req.body.endTime = new Date(req.body.endTime).toISOString();
  const response = await fetch('/v1/event/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

  if (response.code) return renderIndex(req, res, 'create', response.message);
  return res.redirect('/event');
};

/**
 * @function eventPageUpdate
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventPageUpdate = async (req, res) => {
  if (!req.query.select) return res.redirect('/event');

  // response.data.startTime = new Date(response.data.startTime)
  //   .toISOString()
  //   .slice(0, new Date(response.data.startTime).toISOString().lastIndexOf(':'));
  //
  // response.data.endTIme = new Date(response.data.endTime)
  //   .toISOString()
  //   .slice(0, new Date(response.data.endTime).toISOString().lastIndexOf(':'));

  return renderIndex(req, res, 'update', '');
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

  if (response.code) return renderIndex(req, res, 'update', response.message, { id, body: req.body });

  res.redirect('/event/update');
};

/**
 * @function eventDeleteForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const eventDeleteForm = async (req, res) => {
  const { id } = req.query;
  if (id === 'all') {
    const ids = Object.values(req.body);
    await fetch(`/v1/event/delete-many`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
      body: JSON.stringify({ ids }),
    });
  } else if (id) {
    await fetch(`/v1/event/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.session.token.access.token}`,
      },
    });
  }
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

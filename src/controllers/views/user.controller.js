const fetch = require('../../utils/fetch');

/**
 * @function pageIndex
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const pageIndex = async (req, res, local = {}) => {
  const users = await fetch.fetchUsers(req);
  return res.render('users/index', {
    users,
    local,
    method: req.query.method || 'none',
    select: req.query.select,
    page: req.query.page,
  });
};

/**
 * @function mainPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const mainPage = async (req, res) => {
  return pageIndex(req, res);
};

/**
 * @function createForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const createForm = async (req, res) => {
  const local = {};
  const response = await fetch('/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application-json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  });

  if (response.code) {
    local.fail = {
      message: response.message,
      body: req.body,
    };
    return pageIndex(req, res, local);
  }

  return res.redirect('/users');
};

/**
 * @function createForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const updateForm = async (req, res) => {
  const local = {};
  const response = await fetch(`/v1/users/${req.params.userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application-json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  });

  if (response.code) {
    local.fail = {
      message: response.message,
      body: req.body,
    };
    return pageIndex(req, res, local);
  }

  return res.redirect('/users');
};

const deleteForm = async (req, res) => {
  const local = {};
  const response = await fetch(`/v1/users/${req.params.userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application-json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  });

  if (response.code) {
    local.fail = {
      message: response.message,
      body: req.body,
    };
    return pageIndex(req, res, local);
  }

  return res.redirect('/users');
};

module.exports = {
  mainPage,
  createForm,
  updateForm,
  deleteForm,
};

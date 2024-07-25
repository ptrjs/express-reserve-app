const fetch = require('../../utils/fetch');
const { createNavlist } = require('./home.controller');
const config = require('../../config/config');

/**
 * @function pageIndex
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const pageIndex = async (req, res, local = {}) => {
  const response = await fetch.fetchUsers(req);
  return res.render('users/index', {
    navs: createNavlist(req.session.user.role),
    users: response.data,
    local,
    method: req.query.method || 'none',
    select: req.query.select,
  });
};

/**
 * @function isConfirm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const isConfirm = (req, res, message = 'mau gak ngapa ngapain ?') => {
  const local = {};
  if (!req.body.confirmationPassword) {
    local.confirmation = {
      url: req.url,
      message,
      body: req.body,
    };
    pageIndex(req, res, local);
    return false;
  }
  if (req.body.confirmationPassword !== config.admin.secret) {
    delete req.body.confirmationPassword;
    return isConfirm(req, res, 'admin password salah !');
  }
  delete req.body.confirmationPassword;
  return true;
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
  req.query.method = 'create';
  if (!isConfirm(req, res, 'mau bikin user ?')) return;
  const local = {};
  const response = await fetch('/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

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
  if (!isConfirm(req, res, 'mau ubah user ?')) return;
  const local = {};
  if (!req.body.password.length) delete req.body.password;
  if (req.body.emailBefore === req.body.email) delete req.body.email;
  delete req.body.emailBefore;
  const response = await fetch(`/v1/users/${req.params.userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

  if (response.code) {
    local.fail = {
      message: response.message,
      body: req.body,
    };
    req.query.method = 'none';
    return pageIndex(req, res, local);
  }

  return res.redirect('/users');
};

const deleteForm = async (req, res) => {
  if (!isConfirm(req, res, 'mau hapus user ?')) return;
  const local = {};
  const response = await fetch(`/v1/users/${req.params.userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token.access.token}`,
    },
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

  if (response.code) {
    local.fail = {
      message: response.message,
      body: req.body,
    };
    req.query.method = 'none';
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

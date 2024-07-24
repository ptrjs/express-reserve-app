const config = require('../../config/config');
const fetch = require('../../utils/fetch');

/**
 * @function loginPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const loginPage = (_, res) => {
  res.render('auth/login.ejs', { message: '' });
};

/**
 * @function loginForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const loginForm = async (req, res) => {
  const response = await fetch('/v1/auth/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

  if (response.code) return res.render('auth/login.ejs', { message: response.message });
  req.session.token = response.tokens;
  req.session.user = { name: response.user.name, role: response.user.role, id: response.user.id };
  return res.redirect('/home');
};

/**
 * @function registerPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const registerPage = (req, res) => {
  if (Reflect.has(req.query, 'admin') && Reflect.has(req.session, 'register'))
    return res.render('auth/registerAsAdmin.ejs', { message: '' });
  res.render('auth/register.ejs', { message: '' });
};

/**
 * @function registerForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const registerForm = async (req, res) => {
  if (Reflect.has(req.query, 'admin') && Reflect.has(req.session, 'register')) {
    if (req.body.password !== config.admin.secret)
      return res.render('auth/registerAsAdmin.ejs', { message: 'wrong password' });
    req.session.register.role = 'admin';
  } else {
    delete req.session.register;
  }
  if ('admin' in req.body) {
    req.session.register = req.body;
    delete req.body.admin;
    return res.redirect('/auth/register?admin=');
  }
  if (req.session.register) {
    req.body = req.session.register;
    delete req.session.register;
  }
  const response = await fetch('/v1/auth/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(req.body),
  }).then((x) => x.json());

  if (response.code) return res.render('auth/register.ejs', { message: response.message });
  req.session.token = response.tokens;
  req.session.user = { name: response.userCreated.name, role: response.userCreated.role, id: response.userCreated.id };
  return res.redirect('/home');
};

/**
 * @function forgotPasswordPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const forgotPasswordPage = async (_, res) => {
  return res.render('auth/forgot-password', { message: '' });
};

/**
 * @function forgotPasswordForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const forgotPasswordForm = async (req, res) => {
  const response = await fetch('/v1/auth/forgot-password', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(req.body),
  });
  if (!response.ok) return res.render('auth/forgot', { message: (await response.json()).message });

  res.render('auth/forgot-password', { message: 'link untuk me-reset password telah dikrim!' });
};

/**
 * @function forgotPasswordPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const resetPasswordPage = async (req, res) => {
  if (!Reflect.has(req.query, 'token')) return res.redirect('forgot-password');
  const formMethod = `<form method="post" action="reset-password?token=${req.query.token}">`;
  return res.render('auth/reset-password', { message: '', formMethod });
};

/**
 * @function forgotPasswordForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const resetPasswordForm = async (req, res) => {
  const response = await fetch(`/v1/auth/reset-password?token=${req.query.token}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(req.body),
  });

  if (response.ok) return res.redirect('/');
  const formMethod = `<form method="post" action="reset-password?token=${req.query.token}">`;
  return res.render('auth/reset-password', { message: (await response.json()).message, formMethod });
};

/**
 * @function logoutForm
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const logoutForm = async (req, res) => {
  const response = await fetch('/v1/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      refreshToken: req.session.token.refresh.token,
    }),
  });
  if (response.ok) {
    req.session.token = undefined;
    req.session.user = undefined;
    req.session.events = undefined;
  }
  return res.redirect('/');
};

module.exports = {
  loginPage,
  registerPage,
  loginForm,
  registerForm,
  forgotPasswordPage,
  forgotPasswordForm,
  resetPasswordPage,
  resetPasswordForm,
  logoutForm,
};

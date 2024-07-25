const { NOT_FOUND } = require('http-status');
const moment = require('moment');
const fetch = require('../utils/fetch');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const isExpire = (isostring) => {
  return moment().isSameOrAfter(isostring, 'hours');
};

/**
 * @function whenLogin
 * @param {string} role
 */
const whenLogin = (adminOnly = false) =>
  /**
   * @function whenLoginMiddleware
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  catchAsync(async (req, res, next) => {
    if (!req.session.token) return res.redirect('/auth/login');
    const { access, refresh } = req.session.token;
    if (isExpire(access.expires)) {
      if (isExpire(refresh.expires)) return res.redirect('/auth/login');
      const response = await fetch('/v1/auth/refresh-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refresh.token,
        }),
      });

      if (!response.ok) {
        req.session.token = undefined;
        return res.redirect('/auth/login');
      }
      req.session.token = await response.json();
    }
    if (adminOnly && (!req.session.user || req.session.user.role !== 'admin'))
      throw new ApiError(NOT_FOUND, 'Page not found');
    return next();
  });

/**
 * @function whenLogout
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const whenLogout = async (req, res, next) => {
  if (!!req.session.token && !isExpire(req.session.token.refresh)) return res.redirect('/home');
  return next();
};

module.exports = {
  whenLogin,
  whenLogout,
};

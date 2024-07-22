const fetch = require('../utils/fetch');

const isExpire = (isostring) => {
  const now = new Date();
  const expireDate = new Date(isostring);
  return now >= expireDate;
};

/**
 * @function whenLogin
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const whenLogin = async (req, res, next) => {
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
  return next();
};

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

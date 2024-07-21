/**
 * @function loginPage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const login = (_, res) => {
  res.render('auth/login.ejs');
};

const register = (_, res) => {
  res.render('auth/register.ejs');
};

module.exports = {
  login,
  register,
};

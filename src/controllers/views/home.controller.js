const createNavlist = (role) => {
  const navs = [{ name: 'home', path: '/home' }];
  if (role === 'admin') navs.push({ name: 'user', path: '/user' });
  return navs.map((x) => `<a href="${x.path}">${x.name}</a>`);
};

/**
 * @function homePage
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const homePage = (req, res) => {
  let username = 'tanpa nama';
  let role = 'user';
  if (req.session.user) {
    username = req.session.user.name;
    role = req.session.role;
  }
  return res.render('home/index', { username, navs: createNavlist(role) });
};

module.exports = {
  homePage,
};

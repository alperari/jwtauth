module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.signup_post = async (req, res) => {
  res.send('1');
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.login_post = async (req, res) => {
  res.send('2');
};

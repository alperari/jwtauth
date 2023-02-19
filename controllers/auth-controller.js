const User = require('../models/User');

const errorHandler = (err) => {
  const errors = { email: '', password: '' };

  if (err.code === 11000) errors['email'] = 'Email already exists!';

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email: email, password: password });

    return res.status(201).send(user);
  } catch (err) {
    const errors = errorHandler(err);
    return res.status(400).send(errors);
  }
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) res.status(400).send('Invalid inputs');

  res.send('2');
};

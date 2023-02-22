const jwt = require('jsonwebtoken');
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

const generateToken = (id) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const header = {
    algorithm: 'HS256',
    expiresIn: 1 * 24 * 60 * 60,
  };

  const payload = {
    id: id,
  };

  return jwt.sign(payload, JWT_SECRET, header);
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email: email, password: password });

    // Create jwt token on signup and redirect to home view
    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ id: user.id });
  } catch (err) {
    const errors = errorHandler(err);
    return res.status(400).send({ errors: errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) res.status(400).send('Invalid inputs');

  try {
    // Use mongoose static login method
    const user = await User.login(email, password);

    return res.status(201).json({ id: user.id });
  } catch (err) {
    console.log('err:', err);
    const errors = {};
    return res.status(400).send({ errors: errors });
  }

  // Create jwt token on login and redirect to home view
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleErrors = (err) => {
  const errors = { email: '', password: '' };

  if (err.code === 11000) errors['email'] = 'Email already exists!';

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes('email')) {
    errors['email'] = err.message;
  }
  if (err.message.includes('password')) {
    errors['password'] = err.message;
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
      // httpOnly: true,  //if true: frontend cannot read token from cookies
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ id: user.id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send({ errors: errors });
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

    const token = generateToken(user.id);

    res.cookie('token', token, {
      // httpOnly: true,  //if true: frontend cannot read token from cookies
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ id: user.id });
  } catch (err) {
    // If .login static method fails to match password, it will throw an error.
    // Otherwise, it will return user
    const errors = handleErrors(err);
    res.status(400).send({ errors: errors });
  }

  // Create jwt token on login and redirect to home view
};

module.exports.logout_get = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect('/login');
  }

  jwt.verify(token, JWT_SECRET, function (err, decodedToken) {
    if (err) {
      res.redirect('/login');
    }
    //decodedToken: payload of token
    next();
  });
};

const checkUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.locals.user = null;
    next();
  } else {
    jwt.verify(token, JWT_SECRET, async function (err, decodedToken) {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        //decodedToken: payload of token which is {id:<ObjectId>}
        const user = await User.findById(decodedToken.id);

        // Save user document to locals, to reach out in front
        res.locals.user = user;
        next();
      }
    });
  }
};
module.exports = { requireAuth, checkUser };

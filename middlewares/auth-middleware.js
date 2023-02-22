const jwt = require('jsonwebtoken');
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

module.exports = { requireAuth };

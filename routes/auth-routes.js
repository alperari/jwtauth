const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth-controller');

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);
router.get('/login', authController.login_post);

module.exports = router;

const { LOGIN } = require('../controller/login');
const { SIGNUP } = require('../controller/signup');

const router = require('express').Router();


router.post('/login', LOGIN);
router.post('/signup', SIGNUP);

module.exports = router;
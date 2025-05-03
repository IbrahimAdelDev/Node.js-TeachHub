const express = require('express');
const router = express.Router();
const createUser = require('../controllers/user/createUser');
const validateUser = require('../middlewares/user/validateUser');
const authLogin = require('../controllers/user/authLogin&createTokens');
const validateLogin = require('../middlewares/user/validateLogin');
const checkAccessToken = require('../middlewares/user/checkAccessToken');
const checkRefreshToken = require('../middlewares/user/checkRefreshToken');
const regenerateAccessToken = require('../controllers/user/regenerateAccessToken');

router.post('/user/create', validateUser, createUser);
router.post('/user/login', validateLogin, authLogin);
router.get('/user/auth', checkAccessToken, checkRefreshToken, regenerateAccessToken);

module.exports = router;

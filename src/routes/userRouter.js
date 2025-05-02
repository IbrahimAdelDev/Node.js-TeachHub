const express = require('express');
const router = express.Router();
const createUser = require('../controllers/user/createUser');
const validateUser = require('../middlewares/user/validateUser');

router.post('/user/create', validateUser, createUser);

router.get('/user', (req, res) => {
  res.send('Hello, user!');
});


module.exports = router;

const express = require('express');
const router = express.Router();
const createUser = require('../controllers/user/createUser');
const validateUser = require('../middlewares/user/validateUser');
const authLogin = require('../controllers/user/authLogin&createTokens');
const validateLogin = require('../middlewares/user/validateLogin');
const checkToken = require('../middlewares/user/checkTokens');
const authLogout = require('../controllers/user/authLogout');
const getUserByID = require('../controllers/user/getUserByID');
const getAllUsers = require('../controllers/user/getAllUsers');
const authUser = require('../controllers/user/authUser');
const deleteUserByID = require('../controllers/user/deleteUserByID');
const validateUserUpdate = require('../middlewares/user/validateUserUpdate');
const updateUserByID = require('../controllers/user/updateUserByID');
const checkRoleAuthorization = require('../middlewares/user/checkRoleAuthorization');

router.get('/', checkToken, checkRoleAuthorization(['admin', 'superadmin']), getAllUsers); // Get all users
router.get('/auth', checkToken, authUser); // Regenerate access token using refresh token
router.get('/auth/admin', checkToken, checkRoleAuthorization(['admin', 'superadmin']), authUser); // Regenerate access token using refresh token for admin
router.get('/auth/logout', checkToken, authLogout); // Logout a user and delete tokens
router.get('/user/:id', checkToken, getUserByID); // Get a user by ID
router.post('/user/create', validateUserUpdate, createUser); // Create a new user
router.put(
  '/user/update/:id',
  checkToken,
  validateUserUpdate([
    'name',
    'email',
    'username',
    'exams',
    'trueQuestions',
    'falseQuestions',
  ]),
  checkRoleAuthorization(['admin', 'superadmin']),
  updateUserByID
); // Update a user by ID
router.delete('/user/delete/:id', checkToken, checkRoleAuthorization(['admin', 'superadmin']), deleteUserByID); // Delete a user by ID
router.post('/auth/login', validateLogin, authLogin); // Login a user and create tokens


module.exports = router;

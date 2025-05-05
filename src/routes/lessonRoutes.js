const express = require('express');
const router = express.Router();
// const uploadMiddleware = require('../middlewares/lesson/uploadeFilesInPublic'); // in the Hosting
const uploadLessonMiddleware = require('../middlewares/lesson/validationAndUploadInCloud');
const createLesson = require('../controllers/lesson/createLesson');
const checkToken = require('../middlewares/user/checkTokens');
const checkRoleAuthorization = require('../middlewares/user/checkRoleAuthorization');
const getAllLessons = require('../controllers/lesson/getAllLessons');
const getLessonByID = require('../controllers/lesson/getLessonByID');
const deleteLessonByID = require('../controllers/lesson/deleteLessonByID');
const updateMiddleware = require('../middlewares/lesson/validationAndUpdate');
const updateLessonByID = require('../controllers/lesson/updateLessonByID');

router.get('/', checkToken, getAllLessons); // Get all lessons
router.post(
  '/lesson/create',
  checkToken,
  checkRoleAuthorization(['admin', 'superadmin']),
  uploadLessonMiddleware,
  createLesson
); // Create a new lesson
router.get('/lesson/:id', checkToken, getLessonByID); // Get a lesson by ID
router.put(
  '/lesson/update/:id',
  checkToken,
  checkRoleAuthorization(['admin', 'superadmin']),
  updateMiddleware,
  updateLessonByID
); // Update a lesson by ID
router.delete(
  '/lesson/delete/:id',
  checkToken,
  checkRoleAuthorization(['admin', 'superadmin']),
  deleteLessonByID
); // Delete a lesson by ID

module.exports = router;

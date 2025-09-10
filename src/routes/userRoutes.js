const express = require("express");
const router = express.Router();
const createUser = require("../controllers/user/createUser");
const validateUser = require("../middlewares/user/validateUser");
const authLogin = require("../controllers/user/authLogin&createTokens");
const validateLogin = require("../middlewares/user/validateLogin");
const checkToken = require("../middlewares/user/checkTokens");
const authLogout = require("../controllers/user/authLogout");
const getUserByID = require("../controllers/user/getUserByID");
const getAllUsers = require("../controllers/user/getAllUsers");
const authUser = require("../controllers/user/authUser");
const deleteUserByID = require("../controllers/user/deleteUserByID");
const validateUserUpdate = require("../middlewares/user/validateUserUpdate");
const updateUserByID = require("../controllers/user/updateUserByID");
const checkRoleAuthorization = require("../middlewares/user/checkRoleAuthorization");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", checkToken, checkRoleAuthorization(["admin", "superadmin"]), getAllUsers);

/**
 * @swagger
 * /users/auth:
 *   get:
 *     summary: Regenerate access token using refresh token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New access token
 */
router.get("/auth", checkToken, authUser);

/**
 * @swagger
 * /users/auth/admin:
 *   get:
 *     summary: Regenerate access token for admins
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New admin access token
 */
router.get("/auth/admin", checkToken, checkRoleAuthorization(["admin", "superadmin"]), authUser);

/**
 * @swagger
 * /users/auth/logout:
 *   get:
 *     summary: Logout a user and delete tokens
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get("/auth/logout", checkToken, authLogout);

/**
 * @swagger
 * /users/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 */
router.get("/user/:id", checkToken, getUserByID);

/**
 * @swagger
 * /users/user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/user/create", validateUser, createUser);

/**
 * @swagger
 * /users/user/update/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
  "/user/update/:id",
  checkToken,
  validateUserUpdate(["name", "email", "username", "exams", "trueQuestions", "falseQuestions"]),
  checkRoleAuthorization(["admin", "superadmin"]),
  updateUserByID
);

/**
 * @swagger
 * /users/user/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/user/delete/:id", checkToken, checkRoleAuthorization(["admin", "superadmin"]), deleteUserByID);

/**
 * @swagger
 * /users/auth/login:
 *   post:
 *     summary: Login a user and create tokens
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, tokens created
 */
router.post("/auth/login", validateLogin, authLogin);

module.exports = router;

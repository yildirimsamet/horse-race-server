const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');
const { authMiddleware } = require('../../middlewares/auth');

// router.route('/login').post(userController.login)
router.use('/login', userController.login);
router.route('/register').post(userController.register)

module.exports = router;
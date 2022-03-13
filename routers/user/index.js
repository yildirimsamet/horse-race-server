const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');
const { authMiddleware } = require('../../middlewares/auth');

router.use('/login', userController.login);

router.use('/register', userController.register)

router.use('/get-user-info', authMiddleware, userController.getUserInfo)

router.use('/get-horses', authMiddleware, userController.getHorses)


module.exports = router;
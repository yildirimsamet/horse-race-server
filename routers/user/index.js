const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');

router.route('/login').post(userController.login)
router.route('/register').post(userController.register)

module.exports = router;
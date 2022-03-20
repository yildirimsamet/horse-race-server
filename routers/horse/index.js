const express = require('express');
const router = express.Router();
const horseController = require('../../controllers/horse');
const { authMiddleware } = require('../../middlewares/auth');

router.use('/get-horse-chests', horseController.getHorseChests);

router.use('/buy-horse-chest',authMiddleware , horseController.buyHorseChest);

router.use('/feed-horse',authMiddleware , horseController.feedHorse);

router.use('/sell-horse',authMiddleware , horseController.sellHorse);

module.exports = router;
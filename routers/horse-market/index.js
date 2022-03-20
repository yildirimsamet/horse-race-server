const express = require("express");
const router = express.Router();
const horseMarketController = require("../../controllers/horseMarket");
const { authMiddleware } = require("../../middlewares/auth");

router.use("/get-horses", authMiddleware, horseMarketController.getHorses);

router.use("/buy-horse", authMiddleware, horseMarketController.buyHorse);

router.use("/cancel-sell", authMiddleware, horseMarketController.cancelSell);

module.exports = router;

const express = require('express');
const router = express.Router();
const pixelShopController = require('../../controllers/pixel-shop');
const {authMiddleware} = require('../../middlewares/auth');

router.use('/get-items', pixelShopController.getAllItems );
router.use('/buy-item', authMiddleware , pixelShopController.buyItem );

module.exports = router;
const express = require('express');
const router = express.Router();
const pixelShopController = require('../../controllers/pixel-shop');

router.use('/get-items', pixelShopController.getAllItems );

module.exports = router;
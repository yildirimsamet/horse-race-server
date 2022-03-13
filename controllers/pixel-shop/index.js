const path = require("path");
const PixelShopItem = require("../../models/PixelShopItem");
const User = require("../../models/User");

exports.getAllItems = async (req, res, next) => {
  try {
    let [items] = await PixelShopItem.getAllItems();
    items = items.map((item) => {
      return {
        ...item,
        image: item.name.toLowerCase() + ".png",
      };
    });
    return res.json({ items });
  } catch (error) {
    next(error);
  }
};
exports.buyItem = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const { itemId, quantity } = req.body;
    const [[user]] = await User.getUserById(userId);
    const [[item]] = await PixelShopItem.getItemById(itemId);
    const isUserHasEnoughCoins = user.coins >= item.price * quantity;

    if (quantity <= 0)
      return res.json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    if (isUserHasEnoughCoins) {
      const costOfBuy = item.price * quantity;

      await User.changeUserCoins({
        userId,
        coins: costOfBuy,
        operation: "-",
      });
      await User.addItemToUser({ userId, itemName: item.name, quantity });

      return res.json({
        success: true,
        message: "Item bought successfully",
      });
    }

    return res.json({
      success: false,
      message: "You don't have enough coins",
    });
  } catch (error) {
    next(error);
  }
};

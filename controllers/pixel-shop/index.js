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

    if (quantity <= 0) {
      return res.json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const [[user]] = await User.getUserById(userId);
    const [[item]] = await PixelShopItem.getItemById(itemId);

    if (!item) {
      return res.json({ success: false, message: "Item not found" });
    }
    const isUserHasEnoughCoins = user.coins >= item.price * quantity;

    if (isUserHasEnoughCoins) {
      const costOfBuyedItems = item.price * quantity;

      const [result] = await PixelShopItem.buyItem({
        userId,
        itemId,
        quantity,
      });

      if (!result?.affectedRows) {
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      } else {
        await User.changeUserCoins({
          userId,
          coins: costOfBuyedItems,
          operation: "-",
        });
      }

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

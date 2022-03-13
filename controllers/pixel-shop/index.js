const path = require("path");
const PixelShopItem = require("../../models/PixelShopItem");
exports.getAllItems = async (req, res, next) => {
  try {
    let [items] = await PixelShopItem.getAllItems();
    items = items.map((item) => {
      return {
        ...item,
        image: 
          item.name.toLowerCase() + ".png"
      };
    });
    return res.json({ items });
  } catch (error) {
    next(error);
  }
};

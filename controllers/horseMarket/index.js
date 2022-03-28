const User = require("../../models/User");
const HorseMarket = require("../../models/HorseMarket");
const { Horse } = require("../../models/Horse");

exports.getHorses = async (req, res, next) => {
  try {
    const [horsesOnMarket] = await HorseMarket.getMarketItems();
    if (horsesOnMarket && horsesOnMarket.length > 0) {
      return res.json({
        success: true,
        horsesOnMarket,
      });
    }
    return res.json({ success: false, message: "Couldn't get horses!" });
  } catch (error) {
    next(error);
  }
};
exports.cancelSell = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const { marketId } = req.body;
    const [[marketItem]] = await HorseMarket.getMarketItemById(marketId);
    if (!marketItem) {
      return res.json({
        success: false,
        message: "Couldn't find that market item!",
      });
    }
    if (marketItem.ownerId !== userId) {
      return res.json({
        success: false,
        message: "You don't have that market item!",
      });
    }
    await Horse.setHorseIsOnMarketById({
      horseId: marketItem.horseId,
      isOnMarket: false,
    });
    const [isDeleted] = await HorseMarket.removeMarketItem(marketId);
    if (isDeleted.affectedRows > 0) {
      return res.json({ success: true, message: "Market item deleted!" });
    }
    return res.json({
      success: false,
      message: "Couldn't delete market item!",
    });
  } catch (error) {
    next(error);
  }
};
exports.buyHorse = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const { marketId } = req.body;
    const [[marketItem]] = await HorseMarket.getMarketItemById(marketId);
    if (!marketItem) {
      return res.json({
        success: false,
        message: "Couldn't find that market item!",
      });
    }

    const [[[buyerUser]], [[sellerUser]]] = await Promise.all([
      await User.getUserById(userId),
      await User.getUserById(marketItem.ownerId),
    ]);
    if (!buyerUser || !sellerUser) {
      return res.json({ success: false, message: "Couldn't find that user!" });
    }
    const { price } = marketItem;
    if (buyerUser.money < price) {
      return res.json({
        success: false,
        message: "You don't have enough money!",
      });
    }

    const [[buyerMoneyChange], [sellerMoneyChange]] = await Promise.all([
      await User.changeUserCoins({
        userId,
        coins: price,
        operation: "-",
      }),
      await User.changeUserCoins({
        userId: marketItem.ownerId,
        coins: price,
        operation: "+",
      }),
    ]);
    if (
      buyerMoneyChange.affectedRows <= 0 &&
      sellerMoneyChange.affectedRows <= 0
    ) {
      return res.json({
        success: false,
        message: "Something went wrong!",
      });
    }
    await Horse.changeUserOwner({
      horseId: marketItem.horseId,
      newOwnerId: userId,
    });
    await Horse.setHorseIsOnMarketById({
      horseId: marketItem.horseId,
      isOnMarket: false,
    });
    await HorseMarket.removeMarketItem(marketId);

    return res.json({ success: true, message: "Horse succesfully buyed!" });
  } catch (error) {
    next();
  }
};

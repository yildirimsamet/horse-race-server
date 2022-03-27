const HorseChest = require("../../models/HorseChest");
const { Horse } = require("../../models/Horse");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const HorseMarket = require("../../models/HorseMarket");

exports.getHorseChests = async (req, res, next) => {
  try {
    const [horseChests] = await HorseChest.getHorseChests();

    if (horseChests && horseChests.length > 0) {
      return res.status(200).json({
        success: true,
        horseChests,
      });
    }

    return res.json({ success: false, message: "Couldn't get horse chests!" });
  } catch (err) {
    res.status(500).json({
      message: "Failed",
      error: err,
    });
  }
};

exports.buyHorseChest = async (req, res, next) => {
  const token = req.headers.authorization;
  const { id } = jwt.decode(token);
  const { chestLevel } = req.body;
  const buyedHorseData = await HorseChest.buyHorseChest(id, chestLevel);

  if (buyedHorseData) {
    return res.json({
      success: true,
      horse: buyedHorseData,
    });
  }

  return res.json({
    success: false,
    message: "Couldn't buy horse chest!",
  });
};

exports.feedHorse = async (req, res, next) => {
  const { userId } = res.locals;
  const { foodId, foodQuantity, horseId } = req.body;

  const [[isUserHasThatHorse]] = await Horse.getHorsesByUserId(userId);
  if (!isUserHasThatHorse)
    return res.json({ success: false, message: "You don't have that horse!" });

  const [[userFood]] = await User.getUserItemById({
    userId,
    itemId: foodId,
  });

  if (!userFood)
    return res.json({ success: false, message: "You don't have that food!" });

  if (userFood.quantity < foodQuantity)
    return res.json({
      success: false,
      message: "You don't have that much food!",
    });

  const [result] = await Horse.feedHorseById({
    horseId,
    energy: foodQuantity * userFood.energy,
  });
  if (result.affectedRows <= 0)
    return res.json({
      success: false,
      message: "You don't have that much food!",
    });

  await User.updateUserItemQuantity({
    userId,
    itemId: foodId,
    quantity: foodQuantity,
    operation: "-",
  });
 
  return res.json({ success: true, message: "Horse satiety increased!" });
};

exports.sellHorse = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const { horseId, price } = req.body;

    if (!price || price <= 0 || !horseId)
      return res.json({ success: false, message: "Invalid data!" });

    const [usersHorses] = await Horse.getHorsesByUserId(userId);

    const wantToSellHorse = usersHorses.find(
      (horse) => horse?.id === horseId
    );
    if (!wantToSellHorse)
      return res.json({
        success: false,
        message: "You don't have that horse!",
      });
    if(wantToSellHorse.isOnRace) return res.json({success:false, message: "Your horse in on a race" })
    const [[isHorseAlreadyOnMarket]] = await HorseMarket.getMarketItemByHorseId(
      { horseId }
    );
    if (isHorseAlreadyOnMarket)
      return res.json({
        success: false,
        message: "Horse is already on market!",
      });

    const [successfullyOnMarket] = await new HorseMarket({
      userId,
      horseId,
      price,
    }).createMarketItem();
    if (successfullyOnMarket?.insertId) {
      await Horse.setHorseIsOnMarketById({ horseId, isOnMarket: true });

      return res.json({
        success: true,
        message: "Horse successfully on market!",
      });
    }

    return res.send("hello");
  } catch (error) {
    next(error);
  }
};

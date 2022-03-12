const HorseChest = require("../../models/HorseChest");

const jwt = require("jsonwebtoken");
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

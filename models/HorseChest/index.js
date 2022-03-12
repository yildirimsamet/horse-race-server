const db = require("../../config/db");
const User = require("../../models/User");
const {
  Horse,
  HorseLevelOne,
  HorseLevelTwo,
  HorseLevelThree,
} = require("../../models/Horse");

class HorseChest {
  constructor(level, price) {
    this.level = level;
    this.price = price;
  }

  static getHorseChests() {
    const sql = "SELECT * FROM horse_chest";

    return db.execute(sql);
  }
  
  static async buyHorseChest(userId, chestLevel) {
    const [[user]] = await User.getUserById(userId);
    const [[wantedHorseChest]] = await db.execute(
      `SELECT * FROM horse_chest WHERE level = ${chestLevel}`
    );

    if (user.coins >= wantedHorseChest.price) {
      let newHorse;
      const [chestPrices] = await this.getHorseChests();
      const priceOfBuyedChest = chestPrices.find(
        (chestInfo) => chestInfo.level === chestLevel
      ).price;

      switch (chestLevel) {
        case 1:
          newHorse = new HorseLevelOne({ ownerId: userId });
          break;
        case 2:
          newHorse = new HorseLevelTwo({ ownerId: userId });
          break;
        case 3:
          newHorse = new HorseLevelThree({ ownerId: userId });
          break;
        default:
          break;
      }
      await User.changeUserCoins({
        userId,
        coins: priceOfBuyedChest,
        operation: "-",
      });
      await Horse.addNewHorse(newHorse);
      return newHorse;
    }
    return null;
  }
}

module.exports = HorseChest;

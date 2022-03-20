const db = require("../../config/db");
const { Horse } = require("../../models/Horse");
const User = require("../../models/User");
class HorseMarket {
  constructor({ userId, horseId, price }) {
    this.userId = userId;
    this.horseId = horseId;
    this.price = price;
  }
  createMarketItem() {
    const sql = `INSERT INTO horse_sell (ownerId, horseId, price) VALUES (${this.userId}, ${this.horseId}, ${this.price});`;

    return db.execute(sql);
  }
  static removeMarketItem(marketId) {
    const sql = `DELETE FROM horse_sell WHERE id = ${marketId};`;

    return db.execute(sql);
  }
  static async getMarketItems() {
    const [marketItems] = await db.execute(`select * from horse_sell;`);
    if (marketItems.length < 0) return [];
    for (const item of marketItems) {
      const [[[horse]], [[user]]] = await Promise.all([
        Horse.getHorseById(item.horseId),
        User.getUserById(item.ownerId),
      ]);
      delete user.password;
      delete user.coins;
      item.horse = horse;
      item.owner = user;
    }

    return [marketItems];
  }
  static getMarketItemByHorseId({ horseId }) {
    const sql = `SELECT * FROM horse_sell WHERE horseId = ${horseId};`;

    return db.execute(sql);
  }
  static getMarketItemById(marketId) {
    const sql = `SELECT * FROM horse_sell WHERE id = ${marketId};`;

    return db.execute(sql);
  }
}
module.exports = HorseMarket;

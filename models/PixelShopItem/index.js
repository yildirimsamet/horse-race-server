const db = require("../../config/db");
class PixelShopItem {
  constructor({ name, price, energy }) {
    this.name = name;
    this.price = price;
    this.energy = energy;
  }
  static getAllItems() {
    const sql = `SELECT * FROM pixel_shop_item`;
    return db.execute(sql);
  }
  static getItemById(id) {
    const sql = `SELECT * FROM pixel_shop_item WHERE id = ${id}`;
    return db.execute(sql);
  }
  static async buyItem({ userId, itemId, quantity }) {
    const sql = `select * from user_items where ownerId = ${userId} AND itemId = ${itemId};`;
    const [[isUserHaveItem]] = await db.execute(sql);

    if (isUserHaveItem) {
      const sql = `UPDATE user_items SET quantity = quantity + ${quantity} WHERE ownerId = ${userId} AND itemId = ${itemId};`;
      return db.execute(sql);
    } else {
      const sql = `INSERT INTO user_items (ownerId, itemId, quantity) VALUES (${userId}, ${itemId}, ${quantity});`;
      return db.execute(sql);
    }
  }
}
module.exports = PixelShopItem;

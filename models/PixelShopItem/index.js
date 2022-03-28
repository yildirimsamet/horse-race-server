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
    const sql = `SELECT * FROM pixel_shop_item WHERE id = ?;`;
    return db.execute(sql, [id]);
  }
  static async buyItem({ userId, itemId, quantity }) {
    const sql = `select * from user_items where ownerId = ? AND itemId = ?;`;
    const [[isUserHaveItem]] = await db.execute(sql,[userId,itemId]);

    if (isUserHaveItem) {
      const sql = `UPDATE user_items SET quantity = quantity + ? WHERE ownerId = ? AND itemId = ?;`;
      return db.execute(sql,[quantity,userId,itemId]);
    } else {
      const sql = `INSERT INTO user_items (ownerId, itemId, quantity) VALUES (?, ?, ?);`;
      return db.execute(sql,[userId,itemId,quantity]);
    }
  }
}
module.exports = PixelShopItem;

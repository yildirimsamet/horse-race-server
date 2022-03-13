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
}
module.exports = PixelShopItem;

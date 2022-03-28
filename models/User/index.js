const db = require("../../config/db");
const bcrypt = require("bcryptjs");
class User {
  constructor(email, password, name, surname) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.coins = 5000;
  }

  async #isCreateAbleUser() {
    if (!this.email || !this.password || !this.name || !this.surname) {
      return false;
    } else if (!!(await User.getUserByEmail(this.email))[0].length) {
      return false;
    }

    return true;
  }

  async create() {
    if ((await this.#isCreateAbleUser()) == true) {
      var hashedPassword = bcrypt.hashSync(this.password, 8);
      const sql = `INSERT INTO user (email, password, name, surname, coins) VALUES (?, ?, ?, ?, ?);`;

      return db.execute(sql, [
        this.email,
        hashedPassword,
        this.name,
        this.surname,
        this.coins,
      ]);
    }

    return [];
  }

  static getUserById(id) {
    const sql = "SELECT * FROM user WHERE id = ?;";

    return db.execute(sql, [id]);
  }

  static changeUserCoins({ userId, coins, operation }) {
    const sql = `UPDATE user SET coins = coins ${operation} ? WHERE id = ?;`;

    return db.execute(sql, [coins, userId]);
  }

  static getUserByEmail(email) {
    const sql = "SELECT * FROM user WHERE email = ?;";

    return db.execute(sql, [email]);
  }

  static getUserItems(userId) {
    const sql = `SELECT pixel_shop_item.id, pixel_shop_item.energy, pixel_shop_item.price, quantity, name FROM user_items 
                INNER JOIN pixel_shop_item ON user_items.itemId = pixel_shop_item.id WHERE ownerId = ?;`;

    return db.execute(sql, [userId]);
  }
  static getUserItemById({ userId, itemId }) {
    const sql = `SELECT pixel_shop_item.id, pixel_shop_item.energy, pixel_shop_item.price, quantity, name FROM user_items 
            INNER JOIN pixel_shop_item ON user_items.itemId = pixel_shop_item.id WHERE ownerId = ? and pixel_shop_item.id = ?;`;

    return db.execute(sql, [userId, itemId]);
  }
  static updateUserItemQuantity({ userId, itemId, quantity, operation }) {
    const sql = `UPDATE user_items SET quantity = quantity ${operation} ? WHERE ownerId = ? and itemId = ?;`;

    return db.execute(sql, [quantity, userId, itemId]);
  }
}
module.exports = User;

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
      const sql = `INSERT INTO user (email, password, name, surname, coins) VALUES ('${this.email}', '${hashedPassword}', '${this.name}', '${this.surname}', ${this.coins})`;

      return db.execute(sql);
    }

    return [];
  }

  static getUserById(id) {
    const sql = `SELECT * FROM user WHERE id = '${id}'`;

    return db.execute(sql);
  }

  static changeUserCoins({ userId, coins, operation }) {
    const sql = `UPDATE user SET coins = coins ${operation} ${coins} WHERE id = '${userId}'`;

    return db.execute(sql);
  }

  static getUserByEmail(email) {
    const sql = `SELECT * FROM user WHERE email = '${email}'`;

    return db.execute(sql);
  }

  static getUserItems(userId) {
    const sql = `select pixel_shop_item.id, pixel_shop_item.energy, pixel_shop_item.price, quantity, name from user_items 
                  INNER JOIN pixel_shop_item ON user_items.itemId = pixel_shop_item.id where ownerId = ${userId};`;

    return db.execute(sql);
  }
}
module.exports = User;

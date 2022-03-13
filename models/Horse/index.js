const db = require("../../config/db");
const {
  getRandomNumberInRange,
  generateRandomHexColor,
} = require("../../utils/general");

class Horse {
  constructor({ ownerId }) {
    this.ownerId = ownerId;
    this.name = "User " + ownerId + " Horse " + new Date().getTime();
  }

  static getHorsesByUserId(userId) {
    const sql = `SELECT * FROM horse WHERE ownerId = ${userId}`;

    return db.execute(sql);
  }
  static addNewHorse(horse) {
    const sql = `INSERT INTO horse (ownerId, name, color, age, satiety, fatRatio, level, experience, weight ) VALUES (${horse.ownerId}, '${horse.name}', '${horse.color}', ${horse.age}, ${horse.satiety}, ${horse.fatRatio}, ${horse.level}, ${horse.experience}, ${horse.weight})`;

    return db.execute(sql);
  }
}

class HorseLevelOne extends Horse {
  constructor({ ownerId }) {
    super({ ownerId });
    this.color = generateRandomHexColor();
    this.age = getRandomNumberInRange(1, 10);
    this.satiety = getRandomNumberInRange(0, 50);
    this.fatRatio = getRandomNumberInRange(10, 20);
    this.level = 1;
    this.experience = getRandomNumberInRange(100, 900);
    this.weight = getRandomNumberInRange(700, 1000);
  }
}
class HorseLevelTwo extends Horse {
  constructor({ ownerId }) {
    super({ ownerId });
    this.color = generateRandomHexColor();
    this.age = getRandomNumberInRange(3, 8);
    this.satiety = getRandomNumberInRange(30, 80);
    this.fatRatio = getRandomNumberInRange(8, 12);
    this.level = 2;
    this.experience = getRandomNumberInRange(100, 900);
    this.weight = getRandomNumberInRange(500, 700);
  }
}
class HorseLevelThree extends Horse {
  constructor({ ownerId }) {
    super({ ownerId });
    this.color = generateRandomHexColor();
    this.age = getRandomNumberInRange(4, 6);
    this.satiety = getRandomNumberInRange(70, 100);
    this.fatRatio = getRandomNumberInRange(6, 9);
    this.level = 3;
    this.experience = getRandomNumberInRange(100, 900);
    this.weight = getRandomNumberInRange(400, 500);
  }
}
module.exports = { Horse, HorseLevelOne, HorseLevelTwo, HorseLevelThree };

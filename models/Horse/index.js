const db = require("../../config/db");
const {
  getRandomNumberInRange,
  generateRandomHexColor,
} = require("../../utils/general");
const { getRandomHorseName } = require("../../utils/getRandomHorseName");

class Horse {
  constructor({ ownerId }) {
    this.ownerId = ownerId;
    this.name = getRandomHorseName();
  }

  static getHorsesByUserId(userId) {
    const sql = `SELECT * FROM horse WHERE ownerId = ${userId}`;

    return db.execute(sql);
  }
  static addNewHorse(horse) {
    const sql = `INSERT INTO horse (ownerId, name, color, age, satiety, fatRatio, level, experience, weight, title ) VALUES (${horse.ownerId}, '${horse.name}', '${horse.color}', ${horse.age}, ${horse.satiety}, ${horse.fatRatio}, ${horse.level}, ${horse.experience}, ${horse.weight}, '${horse.title}')`;

    return db.execute(sql);
  }
  static decreaseSatiety(number) {
    const sql = `UPDATE horse SET satiety = satiety - ${number} WHERE satiety > 0`;

    return db.execute(sql);
  }
  static increaseAge() {
    const sql = `UPDATE horse SET age = age + 1 WHERE age < 10`;

    return db.execute(sql);
  }
  static handleWeightAllHorses({ number, operation }) {
    const sql = `UPDATE horse SET weight = weight ${operation} ${number} WHERE weight > 0 AND weight < 1000 AND satiety < 50`;

    return db.execute(sql);
  }
  static feedHorseById({ horseId, energy }) {
    const sql = `UPDATE horse SET satiety = satiety + ${energy}, weight = weight + ${energy} WHERE id = ${horseId}`;

    return db.execute(sql);
  }
  static setHorseIsOnMarketById({ horseId, isOnMarket }) {
    const sql = `UPDATE horse SET isOnMarket = ${isOnMarket} WHERE id = ${horseId}`;

    return db.execute(sql);
  }
  static setHorseIsOnRaceById({ horseId, isOnRace }) {
    const sql = `UPDATE horse SET isOnRace = ${isOnRace} WHERE id = ${horseId}`;

    return db.execute(sql);
  }
  static getHorseById(horseId) {
    const sql = `SELECT * FROM horse WHERE id = ${horseId}`;

    return db.execute(sql);
  }
  static changeUserOwner({ horseId, newOwnerId }) {
    const sql = `UPDATE horse SET ownerId = ${newOwnerId} WHERE id = ${horseId}`;

    return db.execute(sql);
  }
  static getUsersHorsesForRace(userId) {
    const sql = `SELECT * FROM horse WHERE ownerId = ${userId} AND isOnRace = 0 AND isOnMarket = 0`;

    return db.execute(sql);
  }
  static changeExperience({ horseId, experience, operation }) {
    const sql = `UPDATE horse SET experience = experience ${operation} ${experience} WHERE id = ${horseId}`;

    return db.execute(sql);
  }
  static giveExperience({ horseIdList, experience }) {
    const sql = `UPDATE horse SET experience = experience + ${experience} WHERE id IN (${horseIdList})`;

    return db.execute(sql);
  }
}

class HorseLevelOne extends Horse {
  constructor({ ownerId }) {
    super({ ownerId });
    this.title = "Common";
    this.color = generateRandomHexColor();
    this.age = getRandomNumberInRange(1, 10);
    this.satiety = getRandomNumberInRange(0, 50);
    this.fatRatio = getRandomNumberInRange(10, 20);
    this.level = 1;
    this.experience = 0;
    this.weight = getRandomNumberInRange(700, 1000);
  }
}
class HorseLevelTwo extends Horse {
  constructor({ ownerId }) {
    super({ ownerId });
    this.title = "Rare";
    this.color = generateRandomHexColor();
    this.age = getRandomNumberInRange(3, 8);
    this.satiety = getRandomNumberInRange(30, 80);
    this.fatRatio = getRandomNumberInRange(8, 12);
    this.level = 2;
    this.experience = 0;
    this.weight = getRandomNumberInRange(500, 700);
  }
}
class HorseLevelThree extends Horse {
  constructor({ ownerId }) {
    super({ ownerId });
    this.title = "Epic";
    this.color = generateRandomHexColor();
    this.age = getRandomNumberInRange(4, 6);
    this.satiety = getRandomNumberInRange(70, 100);
    this.fatRatio = getRandomNumberInRange(6, 9);
    this.level = 3;
    this.experience = 0;
    this.weight = getRandomNumberInRange(400, 500);
  }
}
module.exports = { Horse, HorseLevelOne, HorseLevelTwo, HorseLevelThree };

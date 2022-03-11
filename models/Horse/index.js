const db = require('../../config/db');
class Horse {
    constructor({ ownerId, name, color, muscleRatio, level, experience, age, weight }) {
        this.ownerId = ownerId;
        this.name = name;
        this.color = color;
        this.muscleRatio = muscleRatio;
        this.level = level;
        this.experience = experience;
        this.age = age;
        this.weight = weight;
    }

    static getHorsesByUserId(userId) {
        const sql = `SELECT * FROM horse WHERE ownerId = ${userId}`;
        
        return db.execute(sql);
    }
}
module.exports = Horse;
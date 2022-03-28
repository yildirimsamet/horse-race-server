const db = require('../../config/db')
class Result {
    constructor({raceId,horseId,userId,speed,finishedAt,winPrice=0}){
        this.raceId = raceId;
        this.horseId = horseId;
        this.userId = userId;
        this.speed = speed;
        this.finishedAt = finishedAt;
        this.winPrice = winPrice;
    }
    create () {
        const sql = `INSERT INTO results(raceId,horseId,userId,speed,finishedAt,winPrice) values(?, ?, ?, ?, ?, ?);`;

        return db.execute(sql, [this.raceId, this.horseId, this.userId, this.speed, this.finishedAt, this.winPrice]);
    }
    static getResultsByRaceId (raceId) {
        const sql = `select * from results where raceId = ? order by horseId;`;

        return db.execute(sql, [raceId]);
    }
}
module.exports = Result;
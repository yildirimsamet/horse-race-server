const db = require("../../config/db");
class Participant {
    constructor({raceId,horseId,userId}) {
        this.raceId = raceId;
        this.horseId = horseId;
        this.userId = userId;
    }
    create () {
        const sql = `INSERT INTO participants(raceId, horseId, userId) values(${this.raceId}, ${this.horseId}, ${this.userId})`;

        return db.execute(sql)
    }
    static getParticipants({raceId}) {
        const sql = `select * from participants where raceId = ${raceId}`;
        
        return db.execute(sql)
    };
    static getParticipantById ({raceId, userId}) {
        const sql = `select * from participants where raceId = ${raceId} and userId = ${userId}`;
        
        return db.execute(sql)
    }
    static getParticipantByUserIdAndRaceId ({userId, raceId}) {
        const sql = `select * from participants where userId = ${userId} and raceId = ${raceId}`;
        
        return db.execute(sql)
    }
    static removeParticipant ({raceId, userId}) {
        const sql = `delete from participants where raceId = ${raceId} and userId = ${userId}`;
        
        return db.execute(sql)
    }
}
module.exports = Participant;
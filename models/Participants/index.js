const db = require("../../config/db");
class Participant {
    constructor({raceId,horseId,userId}) {
        this.raceId = raceId;
        this.horseId = horseId;
        this.userId = userId;
    }
    create () {
        const sql = `INSERT INTO participants(raceId, horseId, userId) values(?, ?, ?);`;

        return db.execute(sql, [this.raceId, this.horseId, this.userId]);
    }
    static getParticipants({raceId}) {
        const sql = `select * from participants where raceId = ?;`;
        
        return db.execute(sql, [raceId])
    };
    static getParticipantById ({raceId, userId}) {
        const sql = `select * from participants where raceId = ? and userId = ?;`;
        
        return db.execute(sql, [raceId, userId])
    }
    static getParticipantByUserIdAndRaceId ({userId, raceId}) {
        const sql = `select * from participants where userId = ? and raceId = ?;`;
        
        return db.execute(sql,[userId, raceId])
    }
    static removeParticipant ({raceId, userId}) {
        const sql = `delete from participants where raceId = ? and userId = ?;`;
        
        return db.execute(sql, [raceId, userId])
    }
}
module.exports = Participant;
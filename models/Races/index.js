const db = require("../../config/db");
class Race {
    constructor() {

    }
    static create () {
        const sql = `INSERT INTO races() values();`

        return db.execute(sql)
    }
    static getRaces({limit=8}) {
        const sql = `select * from races order by startTime desc LIMIT ${limit};`;
        
        return db.execute(sql)
    };
    static getRaceById (raceId) {
        const sql = `select * from races where id = ?;`;

        return db.execute(sql, [raceId]);
    }
    static changeRaceCurrentCountById ({raceId,count,operation}){
        const sql = `UPDATE races SET currentCount = currentCount ${operation} ? where id = ?;`

        return db.execute(sql, [count,raceId]);
    }
    static changeStatuPassedRaces () {
        const sql = 'UPDATE races SET statu = 1 WHERE DATE(startTime) < DATE(NOW());';

        return db.execute(sql);
    }
    static chageStatuById ({raceId,statu}) {
        const sql = `UPDATE races SET statu = ? where id = ?;`;

        return db.execute(sql,[statu, raceId]);
    }
    static findNotCalcutaledFinishedRaces () {
        const sql = "SELECT * FROM races WHERE statu = 0 AND startTime < NOW() + INTERVAL 3 HOUR + INTERVAL 15.5 MINUTE;"; 

        return db.execute(sql);
    }
    static removeRaceById (raceId) {
        const sql = `DELETE FROM races WHERE id = ?;`;

        return db.execute(sql, [raceId]);
    }
}
module.exports = Race;
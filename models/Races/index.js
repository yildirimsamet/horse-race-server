const db = require("../../config/db");
class Race {
    constructor() {

    }
    static create () {
        const sql = `INSERT INTO races() values()`

        return db.execute(sql)
    }
    static getRaces({limit=8}) {
        const sql = `select * from races order by startTime desc LIMIT ${limit}`;
        
        return db.execute(sql)
    };
    static getRaceById (raceId) {
        const sql = `select * from races where id = ${raceId}`;

        return db.execute(sql);
    }
    static changeRaceCurrentCountById ({raceId,count,operation}){
        const sql = `UPDATE races SET currentCount = currentCount ${operation} ${count} where id = ${raceId}`

        return db.execute(sql);
    }
    static changeStatuPassedRaces () {
        const sql = 'UPDATE races SET statu = 1 WHERE DATE(startTime) < DATE(NOW())';

        return db.execute(sql);
    }
    static chageStatuById ({raceId,statu}) {
        const sql = `UPDATE races SET statu = ${statu} where id = ${raceId}`;

        return db.execute(sql);
    }
    static findNotCalcutaledFinishedRaces () {
        // 100 = 1min
        const sql = "SELECT * FROM races WHERE statu = 0 AND startTime < NOW()+100"; 

        return db.execute(sql);
    }
    static removeRaceById (raceId) {
        const sql = `DELETE FROM races WHERE id = ${raceId}`;

        return db.execute(sql);
    }
}
module.exports = Race;
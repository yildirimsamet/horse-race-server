const db = require('../../config/db');
class User {
    constructor(email, password, name, surname) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
    }
    async #isCreateAbleUser() {
        if (!this.email || !this.password || !this.name || !this.surname) {
            return false;
        } else if (!!((await User.getUserByEmail(this.email))[0].length)) {
            return false;
        }

        return true;
    }
    async create() {
        if (await this.#isCreateAbleUser() == true) {
            const sql = `INSERT INTO user (email, password, name, surname, coins) VALUES ('${this.email}', '${this.password}', '${this.name}', '${this.surname}', 5000)`;

            return db.execute(sql);
        }

        return [];

    }

    static getAll() {
        const sql = 'SELECT * FROM user';
        const [result] = db.execute(sql);

        return result;
    }

    static getById(id) {
        const sql = 'SELECT * FROM user WHERE id = ?';
        const params = [id];
        const [result] = db.execute(sql, params);

        return result;
    }

    static getUserByEmail(email) {
        const sql = `SELECT * FROM user WHERE email = '${email}'`;
        return db.execute(sql);
    }
}
module.exports = User;
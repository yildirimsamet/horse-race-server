const User = require('../../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res, next) => {
    try {
        const { email, password, name, surname } = req.body;
        const user = new User(email, password, name, surname);
        const [result] = await user.create();


        if (result) {
            const token = jwt.sign({ email: user.email, name: user.name, surname: user.surname }, process.env.JWT_SECRET);
            return res.status(200).json({ success: true, user: { ...user, token } });
        }
        res.status(400).json({ success: false, message: 'Couldn\'t create user!' });

    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [result] = await User.getUserByEmail(email);
        if(result.length < 1) {
            return res.json({ success: false, message: 'User not found!' });
        }
        else if (result.length && result[0].password === password) {
            const token = jwt.sign({ email: result[0].email, name: result[0].name, surname: result[0].surname }, process.env.JWT_SECRET);
            const userInfo = result[0]
            res.status(200).json({ success: true, user: {
                name: userInfo.name,
                surname: userInfo.surname,
                email: userInfo.email,
                coins: userInfo.coins,
            }, token });
        } else {
            res.status(400).json({ success: false, message: 'Wrong email or password!' });
        }
    } catch (error) {
        next(error);
    }
}
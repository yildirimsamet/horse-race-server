require('dotenv').config();
const User = require('../../models/User');
const Horse = require('../../models/Horse');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { email, password, name, surname } = req.body;
        const user = new User(email, password, name, surname);
        const [result] = await user.create();

        if (result) {
            const token = jwt.sign({
                id: result.insertId,
                email: user.email,
                name: user.name,
                surname: user.surname
            }, process.env.JWT_SECRET);

            return res.status(200).json({
                success: true,
                user: {
                    id: result.insertId,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    coins: 5000
                },
                token
            });
        }

        return res.json({
            success: false,
            message: 'Couldn\'t create user!'
        });

    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [result] = await User.getUserByEmail(email);

        if (result.length < 1) {
            return res.json({
                success: false,
                message: 'User not found!'
            });
        }
        else if (result.length && result[0].password === password) {
            const token = jwt.sign({
                id: result[0].id,
                email: result[0].email,
                name: result[0].name,
                surname: result[0].surname
            }, process.env.JWT_SECRET);

            const userInfo = result[0];

            return res.status(200).json({
                success: true, user: {
                    id: userInfo.id,
                    name: userInfo.name,
                    surname: userInfo.surname,
                    email: userInfo.email,
                    coins: userInfo.coins,
                }, token
            });
        } else {
            return res.json({
                success: false,
                message: 'Wrong email or password!'
            });
        }
    } catch (error) {
        next(error);
    }
}

exports.getHorses = async (req, res) => {
    const token = req.headers.authorization;
    const { id } = jwt.decode(token);
    const [result] = await Horse.getHorsesByUserId(id);

    if (result && result.length > 0) {
        return res.json({
            success: true,
            horses: result
        });
    } else {
        return res.json({
            success: false,
            message: 'No horses found!'
        });
    }
}
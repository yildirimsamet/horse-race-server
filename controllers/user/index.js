require("dotenv").config();
const User = require("../../models/User");
const { Horse } = require("../../models/Horse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, surname } = req.body;
    const user = new User(email, password, name, surname);
    const [result] = await user.create();

    if (result) {
      delete user.password;

      const token = jwt.sign(
        {
          id: result.insertId,
          ...user,
        },
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        success: true,
        user: {
          id: result.insertId,
          items: [],
          ...user,
        },
        token,
      });
    }

    return res.json({
      success: false,
      message: "Couldn't create user!",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [[user]] = await User.getUserByEmail(email);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
        },
        process.env.JWT_SECRET
      );

      delete user.password;

      const [userItems] = await User.getUserItems(user.id);
      user.items = userItems || [];

      return res.status(200).json({
        success: true,
        user,
        token,
      });
    } else {
      return res.json({
        success: false,
        message: "Wrong email or password!",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getHorses = async (req, res) => {
  const token = req.headers.authorization;
  const { id } = jwt.decode(token);
  const [result] = await Horse.getHorsesByUserId(id);
  
  if (result && result.length > 0) {
    return res.json({
      success: true,
      horses: result,
    });
  } else {
    return res.json({
      success: false,
      message: "No horses found!",
    });
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { id } = jwt.decode(token);
    const [result] = await User.getUserById(id);
    const [userItems] = await User.getUserItems(id);

    delete result[0].password;

    if (result && result.length > 0) {
      const user = result[0];
      user.items = userItems || [];

      return res.json({
        success: true,
        user,
      });
    } else {
      return res.json({
        success: false,
        message: "No user found!",
      });
    }
  } catch (error) {
    next(error);
  }
};

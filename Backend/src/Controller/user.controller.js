const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({
      message: "Username and password cant be empty",
    });
  }

  const existingUser = await userModel.findOne({ userName: userName });

  if (existingUser) {
    return res.status(401).json({
      message: "User exist please login",
    });
  }

  const hashPass = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    userName: userName,
    password: hashPass,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true only if using HTTPS
    sameSite: "lax",
  });

  return res.status(201).json({
    message: "User created sucessfully",
    user: {
      userName: user.userName,
      _id: user._id,
    },
  });
}

async function loginUser(req, res) {
  const { userName, password } = req.body;

  const user = await userModel.findOne({
    userName: userName,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true only if using HTTPS
    sameSite: "lax",
  });

  res.status(200).json({
    message: "user Logged in ",
    user: {
      userName: user.userName,
      _id: user._id,
    },
  });
}

module.exports = { createUser, loginUser };

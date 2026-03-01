const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        message: "Username and password can't be empty",
      });
    }

    // 🔥 LIMIT TOTAL USERS TO 2
    const totalUsers = await userModel.countDocuments();

    if (totalUsers >= 2) {
      return res.status(403).json({
        message: "Registration closed. Maximum 2 users allowed.",
      });
    }

    const existingUser = await userModel.findOne({ userName });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please login.",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      userName,
      password: hashPass,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production HTTPS
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        userName: user.userName,
        _id: user._id,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

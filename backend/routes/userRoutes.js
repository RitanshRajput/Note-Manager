const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "This Email is Already Taken!" });
  }

  const user = new User({ name, email, password });

  try {
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error Creating User" });
  }
});

//LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  const isMatch = User.isMatch(password);
  if (!isMatch) {
    res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, user });
});

module.exports = router;

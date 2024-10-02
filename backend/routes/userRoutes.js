const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

const router = express.Router();

// REGISTER ROUTE
router.post("/register", registerUser);

//LOGIN ROUTE
router.post("/login", loginUser);

//Logout ROUTE
router.post("/logout", logoutUser);

module.exports = router;

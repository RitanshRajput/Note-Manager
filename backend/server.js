const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/noteDB")
  .then(() => console.log("✅ Mongodb Is Connected Successfully"))
  .catch((err) => console.log("❌ Mongodb having some error : ", err));

app.get("/", (req, res) => {
  console.log("Welcome to Note Manager API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});

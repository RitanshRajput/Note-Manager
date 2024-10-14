const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

//Routes
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect("mongodb://127.0.0.1:27017/noteDB")
  .then(() => console.log("✅ Mongodb Is Connected Successfully"))
  .catch((err) => console.log("❌ Mongodb having some error : ", err));

app.get("/", (req, res) => {
  res.send("Welcome to the Note Manager API");
});

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

module.exports = app;
if (require.main === module) {
  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
  });
}

const express = require("express");
const Note = require("../models/Note");
const protect = require("../middleware/protect");
const upload = require("../middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();

// Helper funtion to delete an image from the server
const deleteImage = (imagePath) => {
  const fullPath = path.join(
    __dirname,
    "..",
    "uploads",
    path.basename(imagePath)
  );
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Failed to delete image: ${imagePath}`, err);
    } else {
      console.log(`Successfully deleted image: ${imagePath}`);
    }
  });
};

// Route to create a new Note
router.post("/create", protect, upload.single("image"), createNote);

// Route to get the notes using pagination
router.get("/", protect, getNotes);

//Route to update the Note
router.put("/:id", protect, upload.single("image"), updateNote);

//Route to Delete the Note
router.delete("/:id", protect, deleteNote);

module.exports = router;

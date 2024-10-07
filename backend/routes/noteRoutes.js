const express = require("express");
const protect = require("../middleware/protect");
const upload = require("../middleware/uploadMiddleware");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();

// Route to create a new Note
router.post("/create", protect, upload.single("image"), createNote);

// Route to get the notes using pagination
router.get("/", protect, getNotes);

//Route to update the Note
router.put("/:id", protect, upload.single("image"), updateNote);

//Route to Delete the Note
router.delete("/:id", protect, deleteNote);

module.exports = router;

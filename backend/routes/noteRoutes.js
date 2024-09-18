const express = require("express");
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const protect = (req, res, next) => {
  // Extract the authorization token from the request headers
  const token = req.headers.authorization;

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Attach user ID to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const router = express.Router();

// Route to create a new Note
router.post("/create", protect, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const note = new Note({ title, content, user: req.user });
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error Creating Note" });
  }
});

// Route to get the notes using pagination
router.get("/", protect, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const notes = await Note.find({ user: req.user })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Note.countDocuments({ user: req.user });

    res.json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

//Route to update the Notes
router.put("/:id", protect, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, content },
      { new: true }
    );

    if (!note) {
      res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error Updating Note" });
  }
});

//Route to Delete the Notes
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Note" });
  }
});

module.exports = router;

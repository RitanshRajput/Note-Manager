const Note = require("../models/Note");
const path = require("path");
const fs = require("fs");

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

const createNote = async (req, res) => {
  const { title, content } = req.body;
  let imagePath = "";

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  if (req.file) {
    imagePath = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
  }

  try {
    const note = new Note({
      title,
      content,
      image: imagePath,
      user: req.user._id,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
};

const getNotes = async (req, res) => {
  const { page = 1, limit = 9, search = "" } = req.query;

  try {
    const searchQuery = search
      ? { user: req.user._id, title: { $regex: search, $options: "i" } }
      : { user: req.user._id };

    const notes = await Note.find(searchQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .exec();

    const count = await Note.countDocuments(searchQuery);

    res.json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalNotes: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notes", error: error.message });
  }
};

const updateNote = async (req, res) => {
  const { title, content } = req.body;
  let imagePath = "";

  if (req.file) {
    imagePath = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user });

    if (!note) {
      res.status(404).json({ message: "Note not found" });
    }

    if (req.file && note.image) {
      deleteImage(note.image);
    }

    note.title = title;
    note.content = content;

    if (imagePath) {
      note.image = imagePath;
    }

    await note.save();

    res.json(note);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Updating Note", error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      res.status(404).json({ message: "Note not found" });
    }

    if (note.image) {
      deleteImage(note.image);
    }

    res.json({ message: "Note Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Note", error: error.message });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };

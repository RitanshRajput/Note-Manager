const express = require("express");
const Note = require("../models/Note");
const protect = require("../middleware/protect");
const upload = require("../middleware/uploadMiddleware");

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
router.post("/create", protect, upload.single("image"), async (req, res) => {
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
    const note = new Note({ title, content, image: imagePath, user: req.user });
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error Creating Note" });
  }
});

// Route to get the notes using pagination
router.get("/", protect, async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const searchQuery = search
      ? { user: req.user, title: { $regex: search, $options: "i" } }
      : { user: req.user };

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
});

//Route to update the Notes
router.put("/:id", protect, upload.single("image"), async (req, res) => {
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

    if (!imagePath) {
      note.image = imagePath;
    }

    await note.save();

    res.json(note);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Updating Note", error: error.message });
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

    if (note.image) {
      deleteImage(note.image);
    }

    res.json({ message: "Note Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Note", error: error.message });
  }
});

module.exports = router;

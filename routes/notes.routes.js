// Require packages and set the variables
const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Require the model
const Note = require("../models/Note.model");
const User = require("../models/User.model");

// Start handling routes

// POST /notes/create -  Create a note
router.post("/notes/create", isAuthenticated, async (req, res, next) => {
  const { title, date, description } = req.body;
  const user = req.payload;
  try {
    const newNote = await Note.create({
      title,
      date,
      description,
    });
    await Note.findByIdAndUpdate(newNote._id, {
      $push: { user: user._id },
    });
    await User.findByIdAndUpdate(user._id, {
      $push: { note: newNote._id },
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /notes -  Get all notes
router.get("/notes", async (req, res, next) => {
  try {
    const response = await Note.find().populate("user");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /notes/:noteId -  Get a single note
router.get("/notes/:noteId", async (req, res, next) => {
  const { noteId } = req.params;
  try {
    const response = await Note.findById(noteId).populate("user");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// PUT /notes/:noteId -  Update a single note
router.put("/notes/:noteId", async (req, res, next) => {
  const { noteId } = req.params;
  const { title, date, description } = req.body;
  try {
    const updateNote = await Task.findByIdAndUpdate(
      noteId,
      { title, date, description },
      { new: true }
    );
    res.status(200).json(updateNote);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE /notes/:noteId -  Delete a single note
router.delete("/notes/:noteId", async (req, res, next) => {
  const { noteId } = req.params;
  try {
    const response = await Note.findByIdAndDelete(noteId);
    res.status(200).json(`Note ${noteId} deleted successfully`);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Export the router
module.exports = router;

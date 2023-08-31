// Require packages and set the variables
const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Require the model
const Event = require("../models/Event.model");
const User = require("../models/User.model");

// Start handling routes

// POST /events/create -  Create an event
router.post("/events/create", isAuthenticated, async (req, res, next) => {
  const user = req.payload;
  const { title, date, description } = req.body;
  try {
    const newEvent = await Event.create({
      title,
      date,
      description,
      completed: false,
    });
    await Event.findByIdAndUpdate(newEvent._id, {
      $push: { user: user._id },
    });
    await User.findByIdAndUpdate(user._id, {
      $push: { event: newEvent._id },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /events -  Get all events
router.get("/events", async (req, res, next) => {
  try {
    const response = await Event.find().populate("user");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /events/:eventId -  Get a single event
router.get("/events/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const response = await Event.findById(eventId).populate("user");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// PUT /events/:eventId -  Update a single event
router.put("/events/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  const { title, date, description, completed } = req.body;
  try {
    const updateEvent = await Task.findByIdAndUpdate(
      eventId,
      { title, date, description, completed },
      { new: true }
    );
    res.status(200).json(updateEvent);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE /events/:eventId -  Delete a single event
router.delete("/events/:eventId", async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const deleteEvent = await Event.findByIdAndDelete(eventId);
    res.status(200).json(deleteEvent);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Export the router
module.exports = router;

// Require packages and set the variables
const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Require the models
const Task = require("../models/Task.model");
const User = require("../models/User.model");

// Start handling routes

// POST /tasks/create -  Create a task
router.post("/tasks/create", isAuthenticated, async (req, res, next) => {
  const user = req.payload;
  const { title, date, description, completed } = req.body;
  try {
    const newTask = await Task.create({
      title,
      date,
      description,
      completed,
    });
    await Task.findByIdAndUpdate(newTask._id, {
      $push: { user: user._id },
    });
    await User.findByIdAndUpdate(user._id, {
      $push: { task: newTask._id },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /tasks -  Get all tasks
router.get("/tasks", isAuthenticated, async (req, res, next) => {
  const user = req.payload;
  try {
    const response = await Task.find({user}).populate("user");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /tasks/:taskId -  Get a single task
router.get("/tasks/:taskId", async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const response = await Task.findById(taskId).populate("user");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// PUT /tasks/:taskId -  Update a single task
router.put("/tasks/:taskId", async (req, res, next) => {
  const { taskId } = req.params;
  const { title, date, description, completed } = req.body;
  console.log(req.body);
  try {
    const updateTask = await Task.findByIdAndUpdate(
      taskId,
      { title, date, description, completed },
      { new: true }
    );
    res.status(200).json(updateTask);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE /tasks/:taskId -  Delete a single task
router.delete("/tasks/:taskId", async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const taskResponse = await Task.findByIdAndDelete(taskId);
    await User.findByIdAndUpdate(taskResponse.user, {
      $pull: { task: taskId },
    });
    res.status(200).json(`Task ${taskId} deleted`);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Export the router
module.exports = router;

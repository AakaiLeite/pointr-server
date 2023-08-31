const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: String,
    date: { type: Date, default: Date.now},
    description: String,
    completed: Boolean,
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Task", taskSchema);

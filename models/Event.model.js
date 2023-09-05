const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    title: String,
    date: Date,
    description: String,
    completed: Boolean,
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Event", eventSchema);

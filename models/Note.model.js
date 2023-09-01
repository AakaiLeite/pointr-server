const { Schema, model } = require("mongoose");

const noteSchema = new Schema(
  {
    title: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Note", noteSchema);

const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model(
  "Note",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

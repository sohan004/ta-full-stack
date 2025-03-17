const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model(
  "User",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      refreshToken: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )
);

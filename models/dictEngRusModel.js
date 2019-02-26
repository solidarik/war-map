const mongoose = require("mongoose");
var dictEngRusSchema = new mongoose.Schema(
  {
    eng: {
      type: String,
      required: "Не задано название на английском",
      unique: true
    },
    rus: {
      type: String,
      required: "Не задано название на русском",
      unique: true
    }
  },
  {
    timestamps: false
  }
);
module.exports = mongoose.model("dictEngRus", dictEngRusSchema, "dictEngRus");

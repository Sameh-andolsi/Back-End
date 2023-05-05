const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  Compétences: { type: [String] },
  yearsOfExperience: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Developer", developerSchema);

const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  website: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employer", employerSchema);

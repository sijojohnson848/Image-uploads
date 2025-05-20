const mongoose = require("mongoose");

const fileUploadSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  createdAt: { type: Date, default: Date.now } // Add this field
});

module.exports = mongoose.model("FileUpload", fileUploadSchema);
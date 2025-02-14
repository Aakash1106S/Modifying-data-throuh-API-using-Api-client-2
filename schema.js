const mongoose = require("mongoose");

// Define the MenuItem schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

// Create and export the model
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;

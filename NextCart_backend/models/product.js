const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

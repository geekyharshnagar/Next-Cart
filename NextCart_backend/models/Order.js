const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        price: Number,
        image: String,
        description: String,
        category: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        adminId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Cancelled", "Shipped", "Delivered"],
          default: "Pending",
        },
      },
    ],
    shipping: {
      pincode: {
        type: String,
        required: true,
      },
      city: String,
      address: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

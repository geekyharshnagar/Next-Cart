
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const axios = require("axios");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {

    const orders = await Order.find();
    const salesData = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = `${item.product}-${new Date(order.createdAt).getMonth() + 1}`;
        salesData[key] = (salesData[key] || 0) + item.quantity;
      });
    });

    const input = Object.entries(salesData).map(([key, value]) => {
      const [productId, month] = key.split("-");
      return { productId, month: parseInt(month), quantity: value };
    });

   
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: `Based on this sales data, predict the quantity for each product for next month:\n${JSON.stringify(input)}\nReturn array of {productId, nextMonthQuantity}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const prediction = response.data.choices[0].message.content;
    const parsed = JSON.parse(prediction);

    res.json({ predictions: parsed });
  } catch (err) {
    console.error(" Sales Prediction Error:", err.message);
    res.status(500).json({ error: "Failed to generate prediction" });
  }
});

module.exports = router;

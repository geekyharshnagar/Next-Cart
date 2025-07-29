const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/", async (req, res) => {
  try {
    const productId = req.query.productId;
    if (!productId) return res.status(400).json({ error: "Missing productId" });

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentOrders = await Order.find({
      createdAt: { $gte: fourteenDaysAgo },
      "products.productId": productId,
    });

    const salesMap = {};

    recentOrders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      order.products.forEach((p) => {
        if (p.productId.toString() === productId) {
          salesMap[date] = (salesMap[date] || 0) + p.quantity;
        }
      });
    });

    const salesCounts = Object.values(salesMap);
    const averageSales = salesCounts.length
      ? Math.round(salesCounts.reduce((a, b) => a + b, 0) / salesCounts.length)
      : 5;

    const predictions = [];
    for (let i = 1; i <= 6; i++) {
      predictions.push({
        week: `Week ${i}`,
        sales: Math.max(
          averageSales + Math.floor(Math.random() * 4 - 2),
          1
        ),
      });
    }

    res.json(predictions); 
  } catch (err) {
    console.error(" Prediction Error:", err.message);
    res.status(500).json({ error: "Failed to predict sales" });
  }
});

module.exports = router;

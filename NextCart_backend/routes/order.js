const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../middleware/verifyAdmin");


function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = userData;
    next();
  });
}


router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ userId: req.params.userId });
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


router.get("/", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const orders = await Order.find({ email: userEmail }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(" Failed to fetch orders", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { cartItems, shipping, paymentMethod } = req.body;
  if (!paymentMethod || !shipping?.pincode || !shipping?.address)
    return res.status(400).json({ message: "Missing required fields" });

  const { email, id: userId } = req.user;
  const enrichedCartItems = [];

  try {
    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.title}` });
      if (product.quantity === 0)
        return res.status(400).json({ message: ` ${product.title} is out of stock` });

      await Product.findByIdAndUpdate(item._id, { $inc: { quantity: -1 } });
      enrichedCartItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        addedBy: product.createdBy,
        adminId: product.createdBy,
        status: "Pending"
      });
    }

    const order = new Order({
      userId,
      email,
      cartItems: enrichedCartItems,
      shipping,
      paymentMethod,
      status: "Pending",
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(" Order saving error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});


router.get("/admin", verifyAdmin, async (req, res) => {
  try {
    const adminId = req.user.id;
    const allOrders = await Order.find({ "cartItems.adminId": adminId }).sort({ createdAt: -1 });

    const filteredOrders = allOrders.map((order) => {
      const relevantItems = order.cartItems.filter((item) => item.adminId?.toString() === adminId);

      return {
        _id: order._id,
        userEmail: order.email,
        shipping: order.shipping,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        cartItems: relevantItems.map(item => ({
          productId: item.productId,
          _id: item._id,
          title: item.title,
          price: item.price,
          image: item.image,
          description: item.description,
          status: item.status
        }))
      };
    });

    res.json(filteredOrders);
  } catch (err) {
    console.error(" Failed to fetch admin orders", err);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
});


router.patch("/:orderId/item/:itemId/status", verifyToken, async (req, res) => {
  const adminId = req.user.id;
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.cartItems.id(req.params.itemId);
    if (!item || item.adminId.toString() !== adminId) {
      return res.status(403).json({ message: "Unauthorized or item not found" });
    }

    item.status = status;
    await order.save();

    res.json({ message: "Order item status updated", updatedItem: item });
  } catch (err) {
    console.error(" Failed to update item status:", err);
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});


router.delete("/:orderId/item/:itemId", verifyToken, async (req, res) => {
  const { orderId, itemId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const itemExists = order.cartItems.id(itemId);
    if (!itemExists) return res.status(404).json({ message: "Item not found" });

    order.cartItems = order.cartItems.filter((item) => item._id.toString() !== itemId);

    if (order.cartItems.length === 0) {
      await order.deleteOne();
    } else {
      await order.save();
    }

    res.json({ message: "Item removed successfully" });
  } catch (err) {
    console.error(" Error removing item:", err);
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const userId = req.user.id || req.user._id;
    if (order.userId.toString() !== userId)
      return res.status(403).json({ message: "Not authorized to delete this order" });

    const nonDeletableItem = order.cartItems.find((item) =>
      ["Shipped", "Delivered"].includes(item.status)
    );
    if (nonDeletableItem) {
      return res.status(403).json({
        message: `Cannot delete: item \"${nonDeletableItem.title}\" is ${nonDeletableItem.status}.`
      });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
});

module.exports = router;


router.get("/low-stock", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    const total = await Product.countDocuments({ quantity: { $lt: 5 } });
    const products = await Product.find({ quantity: { $lt: 5 } })
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch low stock products" });
  }
});
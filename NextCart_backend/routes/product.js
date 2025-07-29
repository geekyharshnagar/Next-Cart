const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const upload = require("../middleware/upload");
const User = require("../models/user");
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, price, description, category, quantity } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ error: "Invalid quantity value" });
    }

    const imageUrl = req.file?.path || req.body.image || "";

    const newProduct = new Product({
      title,
      price,
      description,
      category,
      quantity: parsedQuantity,
      image: imageUrl,
      createdBy: user._id,
    });

    await newProduct.save();
    res.status(201).json({ message: " Product added", product: newProduct });
  } catch (err) {
    console.error(" Product Upload Error:", err);
    res.status(500).json({ error: "Product upload failed" });
  }
});



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



router.get("/", async (req, res) => {
  const { search, category, sort, maxPrice } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  try {
    const filter = {};
if (search && (!category || search === category)) {
 
  filter.$or = [
    { title: { $regex: search, $options: "i" } },
    { category: { $regex: search, $options: "i" } },
  ];
} else {
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }
}

    if (maxPrice) {
      filter.price = { $lte: parseInt(maxPrice) };
    }

    let query = Product.find(filter).populate("createdBy", "name _id");


    if (sort === "asc") query = query.sort({ price: 1 });
    else if (sort === "desc") query = query.sort({ price: -1 });

    const total = await Product.countDocuments(filter);
    const products = await query.skip((page - 1) * limit).limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(" Failed to fetch products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/titles", async (req, res) => {
  try {
    const products = await Product.find({}, "_id title");
    res.json(products);
  } catch (err) {
    console.error(" Error fetching titles:", err);
    res.status(500).json({ error: "Failed to fetch product titles" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name _id");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});



router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });

    if (!product) return res.status(404).json({ error: "Product not found" });

    const isCreatorAdmin =
      user?.isAdmin && product.createdBy.toString() === user._id.toString();
    const isSuperAdmin = user?.isSuperAdmin;

    if (!isCreatorAdmin && !isSuperAdmin) {
      return res.status(403).json({
        error: "Access denied: Only creator admin or superadmin can update",
      });
    }


    const { title, price, description, category, quantity } = req.body;

    const imageUrl = req.file?.path || product.image; 

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        description,
        category,
        quantity,
        image: imageUrl,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error(" Update Product Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});



router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });

    if (!product) return res.status(404).json({ error: "Product not found" });
   if (!user || (!user.isSuperAdmin && (!user.isAdmin || product.createdBy.toString() !== user._id.toString()))) {
  return res.status(403).json({ error: "Access denied: Only creator admin or superadmin can delete" });
}


    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(" Delete Product Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

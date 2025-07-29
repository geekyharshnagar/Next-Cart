require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const generateRoute = require("./routes/generate");
const generateTitleRoute = require("./routes/generateTitle");

const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const authRoutes = require("./routes/auth");
const salesPredictRoute = require("./routes/salesPredict");
const salesPredictor = require("./routes/salesPredictor");
const superadminRoutes = require("./routes/superadmin");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", require("./routes/chatbot"));
app.use("/api/generate", generateRoute);
app.use("/api/generate-title", generateTitleRoute);
app.use("/api/sales-predictor", salesPredictor);
app.use("/api/superadmin", superadminRoutes);


app.get("/", (req, res) => {
  res.send("API is working ");
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sales-predict", salesPredictRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

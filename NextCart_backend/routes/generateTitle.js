const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { category, features } = req.body;

  if (!category || !features) {
    return res.status(400).json({ error: "Category and features are required" });
  }

  const prompt = `Generate a short, catchy product name for a product in the category "${category}" with features: ${features}. Keep it concise, creative, and professional.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiName = response.data.choices[0].message.content.trim();
    res.json({ title: aiName });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate product name" });
  }
});

module.exports = router;

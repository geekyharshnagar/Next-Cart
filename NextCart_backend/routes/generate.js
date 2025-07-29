const express = require("express");
const router = express.Router();
const axios = require("axios");
const upload = require("../middleware/upload");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { title, category, features } = req.body;

  const prompt = `Write a persuasive and concise product description in **1 to 2 lines only**.
Product Title: ${title}
Category: ${category}
Key Features: ${features}
Only include the most important benefits. Do not exceed 2 lines.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 40
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    res.json({ description: reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate description" });
  }
});

module.exports = router;
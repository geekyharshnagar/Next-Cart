const express = require("express");
const router = express.Router();
const axios = require("axios");



router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content.trim() });
  } catch (err) {

    res.status(500).json({ error: "Chatbot failed" });
  }
});

module.exports = router;

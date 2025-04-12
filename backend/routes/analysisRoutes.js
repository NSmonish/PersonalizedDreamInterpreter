const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/api", async (req, res) => {
  const dreamText = req.body.dreamText;

  try {
    const response = await axios.post("http://localhost:5002/predict-emotion", {
      text: dreamText,
    });

    const emotion = response.data.emotion;
    res.json({ emotion }); // ✅ Return JSON instead of rendering a page
  } catch (error) {
    console.error("Emotion prediction failed:", error.message);
    res.status(500).json({ emotion: "Error detecting emotion" });
  }
});

module.exports = router;

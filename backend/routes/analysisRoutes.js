const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET analysis page
router.get("/", (req, res) => {
  res.render("analysis", { emotion: null });
});

// POST form submission
router.post("/", async (req, res) => {
  const dreamText = req.body.dreamText;

  try {
    const response = await axios.post("http://localhost:5001/predict-emotion", {
      text: dreamText,
    });

    const emotion = response.data.emotion;
    res.render("analysis", { emotion });
  } catch (error) {
    console.error("Emotion prediction failed:", error.message);
    res.render("analysis", { emotion: "Error detecting emotion" });
  }
});

module.exports = router;

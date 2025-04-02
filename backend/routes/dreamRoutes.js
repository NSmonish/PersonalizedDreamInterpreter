const express = require("express");
const Dream = require("../models/Dream.js");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { userName, date, description } = req.body;
    const newDream = new Dream({ userName, date, description });
    await newDream.save();
    res.status(201).json({ message: "Dream saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving dream" });
  }
});
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const dreams = await Dream.find({ date });
    if (dreams.length === 0) {
      return res.status(404).json({ message: "No dreams found for this date" });
    }
    res.json(dreams);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving dream" });
  }
});
module.exports = router;

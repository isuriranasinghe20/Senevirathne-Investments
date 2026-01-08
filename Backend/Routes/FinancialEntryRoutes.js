// Routes/FinancialEntryRoutes.js
const express = require("express");
const router = express.Router();
const FinancialEntry = require("../Model/FinancialEntryModel");

// Get all financial entries
router.get("/", async (req, res) => {
  try {
    const entries = await FinancialEntry.find().sort({ date: -1 });
    res.status(200).json({ entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Add new financial entry
router.post("/", async (req, res) => {
  try {
    const { date, amount, description, type } = req.body;

    const newEntry = new FinancialEntry({
      date,
      amount,
      description,
      type
    });

    await newEntry.save();
    res.status(201).json({ message: "Entry added successfully", entry: newEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update financial entry
router.put("/:id", async (req, res) => {
  try {
    const { date, amount, description, type } = req.body;

    const updatedEntry = await FinancialEntry.findByIdAndUpdate(
      req.params.id,
      { date, amount, description, type },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Entry updated successfully", entry: updatedEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete financial entry
router.delete("/:id", async (req, res) => {
  try {
    const deletedEntry = await FinancialEntry.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
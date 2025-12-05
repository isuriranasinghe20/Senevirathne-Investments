const express = require("express");
const router = express.Router();
const ClosedActivity = require("../Model/ClosedActivityModel");

router.get("/:userId", async (req, res) => {
  try {
    const activities = await ClosedActivity.find({ userId: req.params.userId });
    res.json(activities);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
module.exports.ClosedActivity = ClosedActivity;
const express = require("express");
const router = express.Router();
const {
  addActivity,
  getActivitiesByUser,
  updateActivity,
  deleteActivity
} = require("../Controllers/activityController");

// POST - add activity
router.post("/activity", addActivity);

// GET - get all activities for a user
router.get("/activity/:userId", getActivitiesByUser);

// PUT - update activity row
router.put("/activity/:id", updateActivity);

// DELETE - delete activity row
router.delete("/activity/:id", deleteActivity);

module.exports = router;

const Activity = require("../Model/Activity");

// Create activity record
exports.addActivity = async (req, res) => {
  try {
    const { userId, no, date, paidAmount, paid,  } = req.body;

    const activity = new Activity({ userId, no, date, paidAmount, paid });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: "Error adding activity", error: err.message });
  }
};

// Get all activities for a user
exports.getActivitiesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const activities = await Activity.find({ userId }).sort({ no: 1 });
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activities", error: err.message });
  }
};

// Update activity by ID
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Activity.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating activity", error: err.message });
  }
};

// Delete activity by ID
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    await Activity.findByIdAndDelete(id);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting activity", error: err.message });
  }
};

const express = require("express");
const router = express.Router();
const User = require("../Model/UserModel");
const Activity = require("../Model/Activity");
const ClosedUser = require("../Model/ClosedUserModel");
const ClosedActivity = require("../Model/ClosedActivityModel");

/* TOTAL LOAN */
router.get("/loan/total", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: null, totalLoan: { $sum: "$total" } } }
    ]);

    res.json({ totalLoan: result[0]?.totalLoan || 0 });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/loan/time", async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalLoan: { $sum: "$total" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// backend/routes/dashboard.js
router.get("/customers/count", async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    const installmentCustomers = await User.countDocuments({ customerType: "INSTALLMENT" });
    const interestOnlyCustomers = await User.countDocuments({ customerType: "INTEREST_ONLY" });

    res.json({
      totalCustomers,
      installmentCustomers,
      interestOnlyCustomers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/customers/closed/count", async (req, res) => {
  try {
    const totalCustomers = await ClosedUser.countDocuments();

    const installmentCustomers = await ClosedUser.countDocuments({
      customerType: "INSTALLMENT",
    });

    const interestOnlyCustomers = await ClosedUser.countDocuments({
      customerType: "INTEREST_ONLY",
    });

    res.json({
      totalCustomers,
      installmentCustomers,
      interestOnlyCustomers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Sum of total loan amount for all closed customers
router.get("/closed/total", async (req, res) => {
  try {
    const result = await ClosedUser.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$total" } } }
    ]);

    res.json({ totalAmount: result[0]?.totalAmount || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Sum of paidAmount for all closed customers
router.get("/closed/paid-amount", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};

    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const result = await ClosedActivity.aggregate([
      { $match: match },
      { $group: { _id: null, totalPaid: { $sum: "$paidAmount" } } }
    ]);

    res.json({ totalPaid: result[0]?.totalPaid || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../Model/LoginModel");

router.post("/log", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

module.exports = router;

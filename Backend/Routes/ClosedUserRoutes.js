const express = require("express");
const router = express.Router();
const { getClosedUserById, getAllClosedUsers, updateTotalPaid } = require("../Controllers/ClosedUserController");

router.get("/:id", getClosedUserById);
router.get("/", getAllClosedUsers);
router.post("/total/:id", updateTotalPaid);

module.exports = router;



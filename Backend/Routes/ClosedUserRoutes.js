const express = require("express");
const router = express.Router();
const ClosedUserController = require("../Controllers/ClosedUserController");
const { getClosedUserById } = require("../Controllers/ClosedUserController");

router.get("/:id", getClosedUserById);

router.get("/", ClosedUserController.getAllClosedUsers);

module.exports = router;

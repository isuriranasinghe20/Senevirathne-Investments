const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/UserControllers");
const upload = require("../middleware/upload"); 
const User = require("../Model/UserModel");

// Basic user CRUD
router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

// DOCUMENT UPLOAD
router.post(
  "/:id/upload/:type",
  upload.array("files", 10),
  UserController.uploadDocuments
);

// DELETE ONE FILE
router.delete(
  "/:id/delete-file/:type/:index",
  UserController.deleteFile
);

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");

//Insert Model
const User = require("../Model/UserModel");
//Insert User Controller
const UserController = require("../Controllers/UserControllers");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

// File upload routes (POST to /users/:id/upload/:docType)
router.post("/:id/upload/:docType", upload.array("files", 10), UserController.uploadDocuments);

//export
module.exports = router;

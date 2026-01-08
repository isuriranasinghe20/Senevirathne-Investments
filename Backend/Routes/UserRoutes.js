const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UserController = require("../Controllers/UserControllers");

// ------------------ MULTER STORAGE ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ------------------ USER CRUD ROUTES ------------------
router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

// ------------------ FILE UPLOAD ROUTE ------------------
// FRONTEND SENDS → /users/:id/upload/customerNic
router.post("/:id/upload/:docType", upload.array("files"), UserController.uploadDocuments);

// ------------------ DELETE FILE ------------------
router.delete("/:id/delete-file/:docType/:index", UserController.deleteFile);

module.exports = router;

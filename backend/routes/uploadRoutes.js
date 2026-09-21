const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  uploadImage
} = require("../controllers/uploadController");

router.post(
  "/image",
  verifyToken,
  upload.single("image"),
  uploadImage
);

module.exports = router;
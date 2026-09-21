const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  detectItems,
  saveDetectedDonation
} = require("../controllers/aiController");

router.post(
  "/detect",
  verifyToken,
  upload.single("image"),
  detectItems
);

router.post(
  "/save-donation",
  verifyToken,
  saveDetectedDonation
);

module.exports = router;
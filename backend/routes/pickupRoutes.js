const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
  schedulePickup
} = require("../controllers/pickupController");

router.post(
  "/schedule",
  verifyToken,
  schedulePickup
);

module.exports = router;
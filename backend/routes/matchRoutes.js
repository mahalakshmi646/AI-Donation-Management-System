const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
  findMatches,
  confirmMatch
} = require("../controllers/matchController");

// Confirm Match
router.post(
  "/confirm",
  verifyToken,
  confirmMatch
);

// Find Matches
router.get(
  "/:donation_id",
  verifyToken,
  findMatches
);

module.exports = router;
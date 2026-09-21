const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
  addDonation,
  getMyDonations,
  updateDonationStatus
} = require("../controllers/donationController");

router.post("/", verifyToken, addDonation);

router.get("/my", verifyToken, getMyDonations);

router.patch(
  "/:donation_id/status",
  verifyToken,
  updateDonationStatus
);

module.exports = router;
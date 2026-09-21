const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const {
  getDashboardStats
} = require("../controllers/dashboardControllers");

router.get("/stats", verifyToken, getDashboardStats);

module.exports = router;
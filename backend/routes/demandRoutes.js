const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
  addDemand,
  getDemands
} = require("../controllers/demandController");

router.post("/", verifyToken, addDemand);

router.get("/", verifyToken, getDemands);

module.exports = router;
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
  addNGO,
  getNGOs
} = require("../controllers/ngoController");

router.post("/", verifyToken, addNGO);
router.get("/", verifyToken, getNGOs);

module.exports = router;
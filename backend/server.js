const userRoutes = require("./routes/userRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const demandRoutes = require("./routes/demandRoutes");

const donationRoutes = require("./routes/donationRoutes");
const matchRoutes = require("./routes/matchRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const pool = require("./config/db");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/demands", demandRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/pickups", pickupRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/uploads", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("AI Donation Management System Backend Running...");
});

const PORT = process.env.PORT || 5000;
pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
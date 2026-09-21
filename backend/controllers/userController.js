const pool = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, name, email, phone, address, role
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User Not Found"
      });
    }

    res.status(200).json({
      message: "Profile Fetched Successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  getProfile
};
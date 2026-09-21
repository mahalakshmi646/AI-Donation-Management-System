const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM donations WHERE user_id = $1`,
      [userId]
    );

    const pendingResult = await pool.query(
      `SELECT COUNT(*) FROM donations
       WHERE user_id = $1 AND status = 'Pending'`,
      [userId]
    );

    const matchedResult = await pool.query(
      `SELECT COUNT(*) FROM donations
       WHERE user_id = $1 AND status = 'Matched'`,
      [userId]
    );

    const completedResult = await pool.query(
      `SELECT COUNT(*) FROM donations
       WHERE user_id = $1 AND status = 'Completed'`,
      [userId]
    );

    res.status(200).json({
      total: Number(totalResult.rows[0].count),
      pending: Number(pendingResult.rows[0].count),
      matched: Number(matchedResult.rows[0].count),
      completed: Number(completedResult.rows[0].count)
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  getDashboardStats
};
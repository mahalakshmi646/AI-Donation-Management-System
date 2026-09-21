const pool = require("../config/db");

// Schedule Pickup
const schedulePickup = async (req, res) => {
  try {
    const { match_id, pickup_date, pickup_time } = req.body;

    if (!match_id || !pickup_date || !pickup_time) {
      return res.status(400).json({
        message: "Match ID, pickup date and pickup time are required"
      });
    }

    const matchResult = await pool.query(
      "SELECT * FROM matches WHERE id = $1",
      [match_id]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({
        message: "Match Not Found"
      });
    }

    const result = await pool.query(
      `INSERT INTO pickup_schedule
       (match_id, pickup_date, pickup_time, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [match_id, pickup_date, pickup_time, "Scheduled"]
    );

    res.status(201).json({
      message: "Pickup Scheduled Successfully",
      pickup: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  schedulePickup
};
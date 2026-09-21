const pool = require("../config/db");

// Add Donation
const addDonation = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { item_name, quantity, image_url } = req.body;

    if (!item_name || !quantity) {
      return res.status(400).json({
        message: "Item name and quantity are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO donations
       (user_id, item_name, quantity, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, item_name, quantity, image_url]
    );

    res.status(201).json({
      message: "Donation Added Successfully",
      donation: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
const updateDonationStatus = async (req, res) => {
  try {
    const { donation_id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Matched",
      "Packaging Notified",
      "Pickup Scheduled",
      "Collected",
      "Delivered",
      "Acknowledged"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid Donation Status"
      });
    }

    const result = await pool.query(
      `UPDATE donations
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, donation_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Donation Not Found"
      });
    }

    res.json({
      message: "Donation Status Updated Successfully",
      donation: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
// Get My Donations
const getMyDonations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM donations
       WHERE user_id = $1
       ORDER BY id DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  addDonation,
  getMyDonations,
  updateDonationStatus
};
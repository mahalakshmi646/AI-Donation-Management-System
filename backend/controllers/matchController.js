const pool = require("../config/db");

// Find Matches
const findMatches = async (req, res) => {
  try {
    const { donation_id } = req.params;

    const donationResult = await pool.query(
      "SELECT * FROM donations WHERE id = $1",
      [donation_id]
    );

    if (donationResult.rows.length === 0) {
      return res.status(404).json({
        message: "Donation Not Found"
      });
    }

    const donation = donationResult.rows[0];

    const demandResult = await pool.query(
      `SELECT
        d.id AS demand_id,
        d.ngo_id,
        d.item_name,
        d.quantity_required,
        d.priority,
        n.ngo_name,
        n.address
       FROM demand_registry d
       JOIN ngos n ON d.ngo_id = n.id
       WHERE LOWER(d.item_name) = LOWER($1)
       AND d.expiry_date >= CURRENT_DATE`,
      [donation.item_name]
    );

    const matches = demandResult.rows.map((demand) => {
      let score = 50;

      const quantityRatio =
        Math.min(donation.quantity, demand.quantity_required) /
        Math.max(donation.quantity, demand.quantity_required);

      score += quantityRatio * 30;

      score += Math.min(demand.priority, 5) * 4;

      return {
        ...demand,
        match_score: Number(score.toFixed(2)),
        match_reason: `${donation.item_name} matches NGO demand with priority ${demand.priority}`
      };
    });

    matches.sort((a, b) => b.match_score - a.match_score);

    res.json({
      donation,
      total_matches: matches.length,
      matches
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};


// Confirm Match
const confirmMatch = async (req, res) => {
  try {
    const { donation_id, ngo_id, match_score } = req.body;

    if (!donation_id || !ngo_id || match_score === undefined) {
      return res.status(400).json({
        message: "donation_id, ngo_id and match_score are required"
      });
    }

    const donation = await pool.query(
      "SELECT * FROM donations WHERE id = $1",
      [donation_id]
    );

    if (donation.rows.length === 0) {
      return res.status(404).json({
        message: "Donation Not Found"
      });
    }

    const result = await pool.query(
      `INSERT INTO matches
       (donation_id, ngo_id, match_score, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [donation_id, ngo_id, match_score, "Matched"]
    );

    await pool.query(
      `UPDATE donations
       SET status = $1
       WHERE id = $2`,
      ["Matched", donation_id]
    );

    res.status(201).json({
      message: "Match Confirmed Successfully",
      match: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};


module.exports = {
  findMatches,
  confirmMatch
};
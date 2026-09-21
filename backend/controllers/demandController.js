const pool = require("../config/db");

// Add Demand
const addDemand = async (req, res) => {
  try {
    const {
      ngo_id,
      item_name,
      quantity_required,
      priority,
      expiry_date
    } = req.body;

    const result = await pool.query(
      `INSERT INTO demand_registry
      (ngo_id, item_name, quantity_required, priority, expiry_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        ngo_id,
        item_name,
        quantity_required,
        priority,
        expiry_date
      ]
    );

    res.status(201).json({
      message: "Demand Added Successfully",
      demand: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Get All Demands
const getDemands = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT demand_registry.*, ngos.ngo_name
       FROM demand_registry
       JOIN ngos ON demand_registry.ngo_id = ngos.id
       ORDER BY demand_registry.id`
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
  addDemand,
  getDemands
};
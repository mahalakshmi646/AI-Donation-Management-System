const pool = require("../config/db");

// Add NGO
const addNGO = async (req, res) => {
  try {
    const { ngo_name, email, phone, address, priority } = req.body;

    const result = await pool.query(
      `INSERT INTO ngos
      (ngo_name,email,phone,address,priority)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [ngo_name, email, phone, address, priority]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Get All NGOs
const getNGOs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ngos ORDER BY id");

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  addNGO,
  getNGOs
};
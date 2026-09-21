const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const detectItems = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    const formData = new FormData();

    formData.append(
      "image",
      fs.createReadStream(req.file.path)
    );

    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect",
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    res.status(200).json({
      message: "AI Detection Successful",
      image_url: `/uploads/${req.file.filename}`,
      ...aiResponse.data
    });

  } catch (error) {
    console.error(
      "AI Detection Error:",
      error.message
    );

    res.status(500).json({
      message: "AI Detection Failed"
    });
  }
};
const saveDetectedDonation = async (req, res) => {
  try {
    const pool = require("../config/db");

    const user_id = req.user.id;

    const {
      item_name,
      category,
      quantity,
      image_url
    } = req.body;

    if (!item_name || !quantity) {
      return res.status(400).json({
        message: "Item name and quantity are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO donations
       (user_id, item_name, quantity, image_url, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user_id,
        item_name,
        quantity,
        image_url,
        "Pending"
      ]
    );

    res.status(201).json({
      message: "AI Detected Donation Saved Successfully",
      category,
      donation: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  detectItems,
  saveDetectedDonation
};
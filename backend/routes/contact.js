const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject = 'No Subject', message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      });
    }

    // Basic email format check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      data: { id: rows[0].id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

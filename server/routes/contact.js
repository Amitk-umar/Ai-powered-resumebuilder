const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/** POST /api/contact — submit a contact form message. */
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, 'Name, email and message are required');
  }

  const contact = await Contact.create({ name, email, subject, message });
  res.status(201).json({ success: true, contact });
}));

module.exports = router;

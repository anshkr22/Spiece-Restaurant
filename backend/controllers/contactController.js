const pool = require('../config/database');

exports.submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    const [result] = await pool.query(
      "INSERT INTO contact_messages (name, email, phone, message, status) VALUES (?, ?, ?, ?, 'unread')",
      [name, email, phone || '', message]
    );

    const [newMessage] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: newMessage[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.getContactMessages = async (req, res, next) => {
  try {
    const [messages] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await pool.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ success: true, message: 'Message status updated' });
  } catch (err) {
    next(err);
  }
};

const pool = require('../config/database');

exports.getReviews = async (req, res, next) => {
  try {
    const { status = 'approved', all } = req.query;
    let query = 'SELECT * FROM reviews';
    const params = [];

    if (!all && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [reviews] = await pool.query(query, params);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { name, rating, comment, image } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name, rating, and comment.' });
    }

    const defaultAvatar = image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

    const [result] = await pool.query(
      "INSERT INTO reviews (name, rating, comment, image, status) VALUES (?, ?, ?, ?, 'approved')",
      [name, parseInt(rating, 10), comment, defaultAvatar]
    );

    const [newReview] = await pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      data: newReview[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rating, comment } = req.body;

    const [existing] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await pool.query(
      'UPDATE reviews SET status = COALESCE(?, status), rating = COALESCE(?, rating), comment = COALESCE(?, comment) WHERE id = ?',
      [status, rating, comment, id]
    );

    const [updated] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Review updated', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

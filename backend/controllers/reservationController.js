const pool = require('../config/database');

exports.createReservation = async (req, res, next) => {
  try {
    const { name, phone, email, date, time, number_of_people, special_request } = req.body;

    if (!name || !phone || !email || !date || !time || !number_of_people) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, phone, email, date, time, number_of_people.'
      });
    }

    // Find or create customer
    let customerId = null;
    const [existingCust] = await pool.query('SELECT id FROM customers WHERE email = ? OR phone = ? LIMIT 1', [email, phone]);
    if (existingCust.length > 0) {
      customerId = existingCust[0].id;
    } else {
      const [custResult] = await pool.query(
        'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email]
      );
      customerId = custResult.insertId;
    }

    const [result] = await pool.query(
      `INSERT INTO reservations (
        customer_id, name, phone, email, reservation_date, reservation_time, number_of_people, special_request, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [customerId, name, phone, email, date, time, number_of_people, special_request || '']
    );

    const [newRes] = await pool.query('SELECT * FROM reservations WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: newRes[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.getReservations = async (req, res, next) => {
  try {
    const { status, limit } = req.query;
    let query = 'SELECT * FROM reservations';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY reservation_date DESC, reservation_time ASC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [reservations] = await pool.query(query, params);
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    next(err);
  }
};

exports.getReservationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [reservations] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (reservations.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.status(200).json({ success: true, data: reservations[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const [existing] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    const [updated] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Reservation status updated', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    await pool.query('DELETE FROM reservations WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
};

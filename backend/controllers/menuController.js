const pool = require('../config/database');

exports.getMenuItems = async (req, res, next) => {
  try {
    const { category_id, search } = req.query;
    let query = `
      SELECT m.*, c.name AS category_name 
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (category_id && category_id !== 'all') {
      conditions.push('m.category_id = ?');
      params.push(category_id);
    }

    if (search) {
      conditions.push('(m.name LIKE ? OR m.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY m.id ASC';

    const [items] = await pool.query(query, params);
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

exports.getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [items] = await pool.query(`
      SELECT m.*, c.name AS category_name 
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.id = ?
    `, [id]);

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: items[0] });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const { category_id, name, description, price, image, rating, available } = req.body;

    if (!category_id || !name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide category_id, name, and price.' });
    }

    const defaultImage = image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';

    const [result] = await pool.query(
      'INSERT INTO menu_items (category_id, name, description, price, image, rating, available) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description || '', price, defaultImage, rating || 4.5, available !== undefined ? available : 1]
    );

    const [newItem] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, message: 'Menu item created successfully', data: newItem[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, image, rating, available } = req.body;

    const [existing] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    await pool.query(
      `UPDATE menu_items SET 
        category_id = COALESCE(?, category_id),
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        image = COALESCE(?, image),
        rating = COALESCE(?, rating),
        available = COALESCE(?, available)
      WHERE id = ?`,
      [category_id, name, description, price, image, rating, available, id]
    );

    const [updated] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Menu item updated successfully', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

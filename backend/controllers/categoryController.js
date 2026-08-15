const pool = require('../config/database');

exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const [result] = await pool.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || '']);
    const [newCat] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, message: 'Category created', data: newCat[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await pool.query(
      'UPDATE categories SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
      [name, description, id]
    );

    const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Category updated', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category has associated menu items
    const [items] = await pool.query('SELECT id FROM menu_items WHERE category_id = ?', [id]);
    if (items.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${items.length} menu items associated with it.`
      });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

const pool = require('../config/database');

exports.getCustomers = async (req, res, next) => {
  try {
    const [customers] = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        c.phone, 
        c.email, 
        c.address,
        c.created_at,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total_amount), 0) AS total_spending,
        MAX(o.created_at) AS last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.name, c.phone, c.email, c.address, c.created_at
      ORDER BY total_spending DESC, c.created_at DESC
    `);

    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [customers] = await pool.query(`
      SELECT 
        c.*,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total_amount), 0) AS total_spending,
        MAX(o.created_at) AS last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);

    if (customers.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const [customerOrders] = await pool.query('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [id]);

    res.status(200).json({
      success: true,
      data: {
        ...customers[0],
        orders: customerOrders
      }
    });
  } catch (err) {
    next(err);
  }
};

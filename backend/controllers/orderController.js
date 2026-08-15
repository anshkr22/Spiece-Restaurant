const pool = require('../config/database');
const generateOrderNumber = require('../utils/generateOrderNumber');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder'
});

exports.createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      phone,
      email,
      address,
      order_type, // 'delivery', 'pickup', 'dine_in'
      payment_method, // 'cash_on_delivery', 'online_payment'
      items, // array of { id, name, price, quantity }
      subtotal,
      tax,
      delivery_fee,
      total_amount
    } = req.body;

    if (!name || !phone || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide customer name, phone, and order items.' });
    }

    // 1. Find or create customer in customers table
    let customerId;
    const [existingCust] = await connection.query('SELECT id FROM customers WHERE email = ? OR phone = ? LIMIT 1', [email || '', phone]);
    if (existingCust.length > 0) {
      customerId = existingCust[0].id;
      // Update address if provided
      if (address) {
        await connection.query('UPDATE customers SET address = ? WHERE id = ?', [address, customerId]);
      }
    } else {
      const [custResult] = await connection.query(
        'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
        [name, phone, email || null, address || null]
      );
      customerId = custResult.insertId;
    }

    // 2. Generate unique order number
    const orderNumber = generateOrderNumber();

    // 3. Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        order_number, customer_id, subtotal, tax, delivery_fee, total_amount,
        order_type, delivery_address, payment_method, payment_status, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [
        orderNumber,
        customerId,
        subtotal || 0,
        tax || 0,
        delivery_fee || 0,
        total_amount || 0,
        order_type || 'delivery',
        address || 'Dine-in / Pickup',
        payment_method || 'cash_on_delivery'
      ]
    );

    const orderId = orderResult.insertId;

    // 4. Insert order items
    for (const item of items) {
      const itemSubtotal = (parseFloat(item.price) * parseInt(item.quantity, 10)).toFixed(2);
      await connection.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price, itemSubtotal]
      );
    }

    await connection.commit();

    // Fetch newly created order with details
    const [createdOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [createdItems] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...createdOrder[0],
        customer_name: name,
        items: createdItems
      }
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { status, limit } = req.query;
    let query = `
      SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE o.order_status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [orders] = await pool.query(query, params);

    // Attach items to each order
    for (let order of orders) {
      const [items] = await pool.query(`
        SELECT oi.*, m.name AS item_name, m.image AS item_image
        FROM order_items oi
        LEFT JOIN menu_items m ON oi.menu_item_id = m.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [orders] = await pool.query(`
      SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ? OR o.order_number = ?
    `, [id, id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];
    const [items] = await pool.query(`
      SELECT oi.*, m.name AS item_name, m.image AS item_image
      FROM order_items oi
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?
    `, [order.id]);
    order.items = items;

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await pool.query(
      `UPDATE orders SET 
        order_status = COALESCE(?, order_status),
        payment_status = COALESCE(?, payment_status)
      WHERE id = ?`,
      [order_status, payment_status, id]
    );

    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Order status updated', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', order_id } = req.body;

    const options = {
      amount: Math.round(parseFloat(amount) * 100), // in paise
      currency,
      receipt: `receipt_${order_id || Date.now()}`,
      payment_capture: 1
    };

    try {
      const razorpayOrder = await razorpayInstance.orders.create(options);
      res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        order: razorpayOrder
      });
    } catch (rzpErr) {
      // Mock test response if Razorpay key is test/invalid
      res.status(200).json({
        success: true,
        isMock: true,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        order: {
          id: `order_mock_${Date.now()}`,
          entity: 'order',
          amount: options.amount,
          currency: 'INR',
          status: 'created'
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    let isVerified = true;

    if (razorpay_signature && !razorpay_order_id.startsWith('order_mock_')) {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder');
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');
      isVerified = generated_signature === razorpay_signature;
    }

    if (isVerified && order_id) {
      await pool.query(
        "UPDATE orders SET payment_status = 'paid', order_status = 'confirmed' WHERE id = ?",
        [order_id]
      );
    }

    res.status(200).json({
      success: isVerified,
      message: isVerified ? 'Payment verified successfully' : 'Payment signature verification failed'
    });
  } catch (err) {
    next(err);
  }
};

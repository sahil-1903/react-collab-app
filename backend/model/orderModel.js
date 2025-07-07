const db = require('../db/connection');

const Order = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    return rows;
  },
  
  getById: async (id) => {
    const [orderRows] = await db.query(`
      SELECT o.*, c.name as customer_name, c.email, c.phone, c.address 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `, [id]);
    
    if (orderRows.length === 0) return null;
    
    const [itemRows] = await db.query(`
      SELECT oi.*, p.name, p.category
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    
    return {
      ...orderRows[0],
      items: itemRows
    };
  },
  
  getByCustomerId: async (customerId) => {
    const [rows] = await db.query('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [customerId]);
    return rows;
  },
  
  create: async (order) => {
    const conn = await db.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Create order
      const [orderResult] = await conn.query(
        'INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)',
        [order.customer_id, order.total_amount, order.status || 'pending']
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of order.items) {
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
        
        // Update product stock
        await conn.query(
          'UPDATE products SET quantity = quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      await conn.commit();
      return orderId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  
  updateStatus: async (id, status) => {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
  }
};

module.exports = Order;
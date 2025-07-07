// filepath: c:\statianary shop demo\backend\models\productModel.js
const db = require('../db/connection');

const Product = {
 getAll: async () => {
  const [rows] = await db.query(`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.name
  `);
  return rows;
},
  
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },
create: async (product) => {
  const { name, category_id, quantity, price, description, user_id } = product;
  const [result] = await db.query(
    'INSERT INTO products (name, category_id, quantity, price, description, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name, category_id, quantity, price, description, user_id]
  );
  return result.insertId;
},
  update: async (id, product) => {
    const { name, category_id, quantity, price, description } = product;
    const [result] = await db.query(
      'UPDATE products SET name = ?, category_id = ?, quantity = ?, price = ?, description = ? WHERE id = ?',
      [name, category_id, quantity, price, description, id]
    );
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
  },
  
  updateStock: async (id, quantity) => {
    const [result] = await db.query(
      'UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
      [quantity, id, quantity]
    );
    return result.affectedRows;
  },
  
  getLowStock: async (threshold = 10) => {
    const [rows] = await db.query('SELECT * FROM products WHERE quantity <= ?', [threshold]);
    return rows;
  }
};

module.exports = Product;
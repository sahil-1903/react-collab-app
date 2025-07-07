const db = require('../db/connection');

const Customer = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM customers ORDER BY name');
    return rows;
  },
  
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0];
  },
  
 create: async (customer) => {
  const { name, email, phone, address, user_id } = customer;
  const [result] = await db.query(
    'INSERT INTO customers (name, email, phone, address, user_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, address, user_id]
  );
  return result.insertId;
},
  
  update: async (id, customer) => {
    const { name, email, phone, address } = customer;
    const [result] = await db.query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone, address, id]
    );
    return result.affectedRows;
  },
  
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Customer;
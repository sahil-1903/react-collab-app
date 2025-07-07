const db = require('../db/connection');

const Category = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT c.*, u.username as created_by
      FROM categories c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.name
    `);
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (category) => {
    const [result] = await db.query(
      'INSERT INTO categories (name, user_id) VALUES (?, ?)',
      [category.name, category.user_id]
    );
    return result.insertId;
  },
  update: async (id, category) => {
    const [result] = await db.query('UPDATE categories SET name = ? WHERE id = ?', [category.name, id]);
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Category;
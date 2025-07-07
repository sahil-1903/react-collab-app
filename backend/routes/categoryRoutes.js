const express = require('express');
const router = express.Router();
const Category = require('../model/categoryModel');
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Get user_id from JWT
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const id = await Category.create({ ...req.body, user_id });
    res.status(201).json({ id, ...req.body, user_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Category.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
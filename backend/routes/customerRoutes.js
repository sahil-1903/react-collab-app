const express = require('express');
const router = express.Router();
const Customer = require('../model/customerModel');
const jwt = require('jsonwebtoken'); // <-- Add this line

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;
    req.body.user_id = user_id;
    const customerId = await Customer.create(req.body);
    res.status(201).json({ id: customerId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const updated = await Customer.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Customer.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await Order.getByCustomerId(req.params.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;